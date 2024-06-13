import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
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
import { NotificationsService } from 'src/notifications/notifications.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

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
    @Inject(Services.NOTIFICATION)
    private readonly notificationService: NotificationsService,
    @Inject(Services.SHOPS)
    private readonly shopService: ShopService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private eventEmitter: EventEmitter2,
  ) {}

  async createListOrder({
    id,
    shop_order_ids_new,
    address,
  }: ICreateListOrders): Promise<any> {
    const result = [];
    const user = await this.userRepository.findOneBy({
      id: id,
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
        id,
      });
      const notification = await this.notificationService.create({
        noti_title: 'Đơn đặt hàng mời',
        noti_url: 'Đơn đặt hàng mời',
        noti_desc: 'Đơn đặt hàng mời',
        shopReceiverId: shop.id,
      });
      this.eventEmitter.emit('notification.create', {
        notification,
        shopId: shop.id,
      });
      result.push(order);
    }

    return result;
  }

  async create(createListOrderDto: CreateListOrderDto): Promise<any> {
    const { productIds, id, codeId, shopId, address } = createListOrderDto;
    const shop = await this.shopService.checkShopIsActive(shopId);
    if (!shop) throw new BadRequestException('Shop is not active.');
    const discount = await this.discountsService.findOneByCode(codeId);
    let total_price_apply_discount = 0;
    let total_price = productIds.reduce(
      (acc, product) => (acc += product.price * product.quantity),
      0,
    );

    if (discount) {
      const applyDiscount = await this.discountsService.applyDiscountToProduct({
        ...createListOrderDto,
        id,
        products: productIds,
      });
      total_price = applyDiscount.total_price;
      total_price_apply_discount = applyDiscount.total_price_apply_discount;
    }
    const newOrder = await this.listOrderRepository.save({
      user: { id },
      total_price,
      total_price_apply_discount,
      address,
      discount: discount,
      tracking_number: `${id}${new Date().getTime()}`,
      shop,
    });

    const orderItems = [];
    const orderErrors = [];

    for (const { productAttribute, quantity } of productIds) {
      const lockResult = await this.acquireLock(
        productAttribute.id,
        quantity,
        newOrder,
      );
      if (lockResult.error) {
        orderErrors.push({
          message: lockResult.message,
          status: lockResult.error,
          product: productAttribute,
        });
      } else {
        await this.productService.updateSoldProduct(
          quantity,
          productAttribute.product.id,
        );
        orderItems.push(lockResult.order);
      }
      if (lockResult.isReleaseLock) {
        await this.releaseLock(lockResult.isReleaseLock);
      }
    }
    if (orderItems.length > 0) {
      if (discount) {
        await this.discountsService.updateUseCount(discount);
      }
      await this.listOrderRepository.save({
        ...newOrder,
        order: orderItems,
      });
      return { order: newOrder, message: orderErrors };
    }
    await this.listOrderRepository.delete({ id: newOrder.id });
    return { order: null, message: orderErrors };
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
        'discount',
        'order',
        'order.product',
        'order.productAttribute',
        'order.product.picture',
        'shop',
      ],
      order: {
        createdAt: 'DESC',
      },
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
        'discount',
        'order',
        'order.productAttribute',
        'order.product.picture',
        'order.product',
        'shop',
        'user',
      ],
      select: {
        ...ListOrder,
        shop: {
          id: true,
          avatar: true,
          background: true,
          email: true,
          userName: true,
        },
        user: {
          id: true,
          avatar: true,
          background: true,
          email: true,
          userName: true,
        },
      },
      order: {
        createdAt: 'ASC',
      },
    });
    const lastPage = Math.floor(total / limit);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;
    return {
      data: res,
      lastPage,
      nextPage,
      prevPage,
    };
  }

  async findOne(id: string): Promise<ListOrder> {
    const res = await this.listOrderRepository.findOne({
      where: { id },
      relations: [
        'discount',
        'order',
        'order.productAttribute',
        'order.product',
        'address',
        'user',
        'shop',
      ],
      select: {
        ...ListOrder,
        user: {
          id: true,
          email: true,
          avatar: true,
          userName: true,
        },
        shop: {
          id: true,
          email: true,
          avatar: true,
          userName: true,
        },
      },
    });
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

  async cancelOrder(
    id: string,
    userId?: string,
    shopId?: string,
  ): Promise<ListOrder> {
    let listOrder = await this.findOne(id);
    if (!listOrder) throw new NotFoundException('Order not found!');
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
    listOrder = await this.listOrderRepository.save({
      ...listOrder,
      status: StatusOrder.CANCELLED,
    });
    const notification = await this.notificationService.create({
      noti_title: 'Đơn đặt hàng đã bị hủy',
      noti_url: 'Đơn đặt hàng mời',
      noti_desc: 'Đơn đặt hàng mời',
      userReceiverId: listOrder.user.id,
      shopReceiverId: listOrder.shop.id,
    });
    this.eventEmitter.emit('notification.create', {
      notification,
      userId: userId ? undefined : listOrder.user.id,
      shopId: shopId ? undefined : listOrder.user.id,
    });
    return listOrder;
  }

  async confirmOrder(id: string): Promise<ListOrder> {
    let listOrder = await this.findOne(id);
    if (!listOrder) throw new NotFoundException('Order not found!');
    listOrder = await this.listOrderRepository.save({
      ...listOrder,
      status: StatusOrder.CONFIRMED,
    });
    const notification = await this.notificationService.create({
      noti_title: 'Đơn đặt hàng đã được xác nhận',
      noti_url: 'Đơn đặt hàng mời',
      noti_desc: 'Đơn đặt hàng mời',
      userReceiverId: listOrder.user.id,
    });
    this.eventEmitter.emit('notification.create', {
      notification,
      userId: listOrder.user.id,
    });
    return listOrder;
  }

  async deliveredOrder(id: string): Promise<ListOrder> {
    let listOrder = await this.findOne(id);
    if (!listOrder) throw new NotFoundException('Order not found!');
    listOrder = await this.listOrderRepository.save({
      ...listOrder,
      status: StatusOrder.DELIVERED,
    });
    const notification = await this.notificationService.create({
      noti_title: 'Đơn đặt hàng đang gửi đến đơn vị giao hàng',
      noti_url: 'Đơn đặt hàng mời',
      noti_desc: 'Đơn đặt hàng mời',
      userReceiverId: listOrder.user.id,
    });
    this.eventEmitter.emit('notification.create', {
      notification,
      userId: listOrder.user.id,
    });
    return listOrder;
  }

  async shippingOrder(id: string): Promise<ListOrder> {
    let listOrder = await this.findOne(id);
    if (!listOrder) throw new NotFoundException('Order not found!');
    listOrder = await this.listOrderRepository.save({
      ...listOrder,
      status: StatusOrder.SHIPPING,
    });
    const notification = await this.notificationService.create({
      noti_title: 'Đơn đặt hàng đang trên đường giao hàng',
      noti_url: 'Đơn đặt hàng mời',
      noti_desc: 'Đơn đặt hàng mời',
      userReceiverId: listOrder.user.id,
    });
    this.eventEmitter.emit('notification.create', {
      notification,
      userId: listOrder.user.id,
    });
    return listOrder;
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
