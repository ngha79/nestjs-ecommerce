import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Inventory } from 'src/entities/inventories.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Services } from 'src/utils/constants';
import { ProductService } from 'src/product/services/product.service';
import { UserService } from 'src/user/services/user.service';
import { FindAllInventoryByShop } from './dto/find-all-inventory-shop';
import { UpdateWhenOrder, UpdateWhenUpdate } from './dto/update-when-order';
import { ReservationService } from 'src/reservation/reservation.service';
import { IInventoriesService } from './interfaces/inventories';
import { Order } from 'src/entities/order.entity';
import { Reservation } from 'src/entities/reservation.entity';

@Injectable()
export class InventoriesService implements IInventoriesService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @Inject(forwardRef(() => Services.PRODUCTS))
    private readonly productService: ProductService,
    @Inject(Services.USERS)
    private readonly userService: UserService,
    @Inject(Services.RESERVATION_SERVICE)
    private readonly reservationService: ReservationService,
    private dataSource: DataSource,
  ) {}

  async create(createInventoryDto: CreateInventoryDto): Promise<Inventory> {
    const { productAttributeId, productId, shopId, stock, location } =
      createInventoryDto;
    return await this.inventoryRepository.save({
      stock,
      location,
      product: { id: productId },
      productAttribute: { id: productAttributeId },
      shop: { id: shopId },
    });
  }

  async findAllByShop(
    findAllInventoryByShop: FindAllInventoryByShop,
  ): Promise<any> {
    const { limit, page, shopId } = findAllInventoryByShop;
    const skip = +limit * (+page - 1);

    const currentPage = +page;

    const [res, total] = await this.inventoryRepository.findAndCount({
      where: [
        {
          shop: { id: shopId },
        },
      ],
      relations: ['productAttribute', 'product'],
      take: +limit,
      skip: skip,
    });
    const lastPage = Math.ceil(total / +limit);
    const nextPage = currentPage + 1 > lastPage ? null : currentPage + 1;
    const prevPage = currentPage <= 1 ? null : currentPage - 1;

    return {
      data: res,
      lastPage,
      nextPage,
      prevPage,
    };
  }

  async findOne(id: number): Promise<Inventory> {
    return await this.inventoryRepository
      .createQueryBuilder('inventory')
      .where('inventory.id = :id', { id })
      .leftJoin('inventory.shop', 'shop')
      .leftJoinAndSelect('inventory.productAttribute', 'productAttribute')
      .leftJoinAndSelect('inventory.product', 'product')
      .addSelect(['shop.id', 'shop.userName', 'shop.avatar', 'shop.background'])
      .getOne();
  }

  async addStockToInventory(
    id: number,
    updateInventoryDto: UpdateInventoryDto,
  ): Promise<UpdateResult> {
    return await this.inventoryRepository.update(
      { id },
      { ...updateInventoryDto },
    );
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.inventoryRepository.delete({ id });
  }

  async updateInventoryWhenUserOrder({
    productId,
    quantity,
    order,
  }: UpdateWhenOrder): Promise<any> {
    const inventoryProduct = await this.inventoryRepository.findOne({
      where: {
        productAttribute: { id: productId },
      },
      relations: ['product', 'productAttribute'],
    });
    if (!inventoryProduct.product.isPublish)
      throw new BadRequestException('Sản phẩm không còn hoạt động!');
    if (inventoryProduct.stock < quantity)
      throw new BadRequestException(
        `Số lượng sản phẩm chỉ còn lại ${inventoryProduct.stock}`,
      );
    const orderItem = await this.orderRepository.save({
      listOrder: order,
      quantity: quantity,
      product: inventoryProduct.product,
      productAttribute: inventoryProduct.productAttribute,
    });
    await this.reservationService.create({
      order: orderItem,
      quantity: quantity,
      inventory: inventoryProduct,
    });
    await this.inventoryRepository.save({
      ...inventoryProduct,
      stock: Number(inventoryProduct.stock - quantity),
    });
    return orderItem;
  }

  async updateInventoryWhenOrderCancel(
    updateWhenUpdate: UpdateWhenUpdate,
  ): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.delete(Reservation, {
        order: { id: updateWhenUpdate.orderId },
      });
      await queryRunner.manager.increment(
        Inventory,
        { productAttribute: { id: updateWhenUpdate.productId } },
        'stock',
        updateWhenUpdate.quantity,
      );
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      await queryRunner.release();
    }
    return true;
  }

  async checkInventory(productId: number): Promise<Inventory> {
    return await this.inventoryRepository.findOne({
      where: { productAttribute: { id: productId } },
    });
  }
}
