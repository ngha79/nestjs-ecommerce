import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import {
  CreateListOrderDto,
  ICreateListOrders,
} from './dto/create-list-order.dto';
import { UpdateListOrderDto } from './dto/update-list-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ListOrder, StatusOrder } from 'src/entities/listOrder.entity';
import { DeleteResult, Like, Repository } from 'typeorm';
import { Services } from 'src/utils/constants';
import { OrdersService } from 'src/orders/orders.service';
import { User } from 'src/entities/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InventoriesService } from 'src/inventories/inventories.service';
import { DiscountsService } from 'src/discounts/discounts.service';
import { QuerySearchOrder } from './dto/query-search-order.dto';
import { IListOrdersService } from './interfaces/list-orders';
import { ProductService } from 'src/product/services/product.service';
import { ShopService } from 'src/shops/services/shop.service';

@Injectable()
export class ListOrdersService implements IListOrdersService {
  constructor(
    @InjectRepository(ListOrder)
    private readonly listOrderRepository: Repository<ListOrder>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => Services.ORDER))
    private readonly ordersService: OrdersService,
    @Inject(Services.DISCOUNT)
    private readonly discountsService: DiscountsService,
    @Inject(Services.INVENTORIES)
    private readonly inventoriesService: InventoriesService,
    @Inject(Services.PRODUCTS)
    private readonly productService: ProductService,
    @Inject(Services.SHOPS)
    private readonly shopService: ShopService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createListOrder({
    userId,
    shop_order_ids_new,
    address,
  }: ICreateListOrders): Promise<any> {
    const result = [];
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!user) throw new BadRequestException('User not found!');
    for (const { shop, shop_discounts, item_products } of shop_order_ids_new) {
      // Kiểm tra sự tồn tại của sản phẩm trên máy chủ
      const checkProductServer = await this.productService.checkProductByServer(
        item_products,
      );
      if (!checkProductServer) {
        throw new BadRequestException('Order wrong!');
      }
      const order = await this.create({
        address,
        codeId: shop_discounts,
        productIds: item_products,
        shopId: shop.id,
        userId,
      });
      result.push(order);
    }
    return result;
  }

  async create(createListOrderDto: CreateListOrderDto): Promise<any> {
    const { productIds, userId, codeId, shopId } = createListOrderDto;
    const shop = await this.shopService.checkShopIsActive(shopId);
    if (!shop) throw new BadRequestException('Shop không còn hoạt động.');
    let total_price = 0,
      total_price_apply_discount = 0;
    total_price_apply_discount = total_price = productIds.reduce(
      (acc, product) => acc + product.quantity * product.price,
      0,
    );
    if (codeId) {
      const applydiscount = await this.discountsService.applyDiscountToProduct({
        ...createListOrderDto,
        userId: userId,
        products: productIds,
      });
      total_price = applydiscount.total_price;
      total_price_apply_discount = applydiscount.total_price_apply_discount;
    }

    let newOrder = await this.listOrderRepository.save({
      user: { id: userId },
      total_price: total_price,
      total_price_apply_discount: total_price_apply_discount,
      address: createListOrderDto.address,
      tracking_number: `${userId}${new Date().getTime()}`,
    });

    const orderError = [];
    const listOrderItems = [];
    for (let i = 0; i < productIds.length; i++) {
      const { productAttribute, quantity } = productIds[i];
      const keyLock = await this.acquireLock(
        productAttribute.id,
        quantity,
        newOrder,
      );
      if (keyLock.error)
        orderError.push({
          message: keyLock.message,
          product: productAttribute,
        });
      if (keyLock.isReleaseLock) {
        await this.releaseLock(keyLock.isReleaseLock);
        listOrderItems.push(keyLock.order);
      }
    }
    newOrder = await this.listOrderRepository.save({
      ...newOrder,
      order: listOrderItems,
      shop: shop,
    });
    return { order: newOrder, message: orderError };
  }

  async acquireLock(productId: number, quantity: number, order: ListOrder) {
    const key = `lock_v2024_${productId}`;
    const retryTimes = 10;
    const expireTime = 30000;
    for (let i = 0; i < retryTimes; i++) {
      await this.cacheManager.set('key', key);
      const result = await this.cacheManager.get('key');
      if (result) {
        try {
          const isReservation =
            await this.inventoriesService.updateInventoryWhenUserOrder({
              productId,
              quantity,
              order,
            });
          if (isReservation) {
            await this.cacheManager.set('key', key, expireTime);
            return { isReleaseLock: 'key', order: isReservation };
          }
          return null;
        } catch (error) {
          return { message: error.message, error: 10020 };
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }
  }

  async releaseLock(keyLock: string): Promise<void> {
    return await this.cacheManager.del(keyLock);
  }

  async findAll(querySearchOrder: QuerySearchOrder): Promise<any> {
    const limit = +querySearchOrder.limit;
    const page = +querySearchOrder.page;
    const skip = (page - 1) * limit;
    const user = await this.userRepository.findOneBy({
      id: querySearchOrder.userId,
    });
    if (!user) throw new BadRequestException('User not found!');
    let query: any = [
      {
        user: { id: querySearchOrder.userId },
        status: querySearchOrder.status,
      },
    ];
    if (querySearchOrder.search)
      query = [
        {
          tracking_number: Like(`%${querySearchOrder.search}%`),
          user: { id: querySearchOrder.userId },
          status: querySearchOrder.status,
        },
        {
          order: { product: { slug: Like(`%${querySearchOrder.search}%`) } },
          user: { id: querySearchOrder.userId },
          status: querySearchOrder.status,
        },
        {
          shop: { userName: Like(`%${querySearchOrder.search}%`) },
          user: { id: querySearchOrder.userId },
          status: querySearchOrder.status,
        },
      ];
    const [res, total] = await this.listOrderRepository.findAndCount({
      where: query,
      skip: skip,
      take: limit,
      relations: [
        'discounts',
        'order',
        'order.product',
        'order.productAttribute',
        'order.product.picture',
        'shop',
      ],
    });
    const deletePass = res?.map((order) => {
      delete order.shop.password;
      delete order.shop.money;
      delete order.shop.isActive;
      return order;
    });
    const lastPage = Math.floor(total / limit);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;
    return {
      data: deletePass,
      lastPage,
      nextPage,
      prevPage,
    };
  }

  async findAllShop(querySearchOrder: QuerySearchOrder): Promise<any> {
    const limit = +querySearchOrder.limit;
    const page = +querySearchOrder.page;
    const skip = (page - 1) * limit;
    let query: any = [
      {
        shop: { id: querySearchOrder.shopId },
        status: querySearchOrder.status,
      },
    ];
    if (querySearchOrder.search)
      query = [
        {
          tracking_number: Like(`%${querySearchOrder.search}%`),
          shop: { id: querySearchOrder.shopId },
          status: querySearchOrder.status,
        },
        {
          order: { product: { slug: Like(`%${querySearchOrder.search}%`) } },
          shop: { id: querySearchOrder.shopId },
          status: querySearchOrder.status,
        },
      ];
    const [res, total] = await this.listOrderRepository.findAndCount({
      where: query,
      skip: skip,
      take: limit,
      relations: [
        'discounts',
        'order',
        'order.productAttribute',
        'order.product.picture',
        'order.product',
        'shop',
      ],
    });
    const deletePass = res?.map((order) => {
      delete order.shop.password;
      delete order.shop.money;
      delete order.shop.isActive;
      return order;
    });
    const lastPage = Math.floor(total / limit);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;
    return {
      data: deletePass,
      lastPage,
      nextPage,
      prevPage,
    };
  }

  async findOne(id: string): Promise<ListOrder> {
    const res = await this.listOrderRepository.findOne({
      where: { id },
      relations: [
        'discounts',
        'order',
        'order.productAttribute',
        'order.product',
        'address',
        'user',
      ],
    });
    delete res.user.password;
    return res;
  }

  async findOneDetail(id: number): Promise<ListOrder> {
    return await this.listOrderRepository
      .createQueryBuilder('list_order')
      .leftJoinAndSelect('list_order.order', 'order')
      .leftJoinAndSelect('order.product', 'product')
      .leftJoinAndSelect('product.shopId', 'shop')
      .leftJoinAndSelect('product.ProductAttribute', 'ProductAttribute')
      .where('list_order.user = :id', { id })
      .getOne();
  }

  async updateStatus(
    id: string,
    updateListOrderDto: UpdateListOrderDto,
  ): Promise<ListOrder> {
    const listOrder = await this.findOne(id);
    if (updateListOrderDto.status === StatusOrder.CANCELLED) {
      const orders = await this.ordersService.findAll(listOrder.id);
      orders.forEach(async (order) => {
        if (order.product.isPublish) {
          await this.inventoriesService.updateInventoryWhenOrderCancel({
            orderId: order.id,
            productId: order.productAttribute.id,
            quantity: order.quantity,
          });
        }
      });
    }
    return await this.update(listOrder, updateListOrderDto);
  }

  async update(
    listOrder: ListOrder,
    updateListOrderDto: UpdateListOrderDto,
  ): Promise<ListOrder> {
    return await this.listOrderRepository.save({
      ...listOrder,
      status: updateListOrderDto.status,
    });
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.listOrderRepository.delete({ id });
  }
}
