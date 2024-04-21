import { Inject, Injectable } from '@nestjs/common';
import { CreateMultipleOrderDto, CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Services } from 'src/utils/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ProductService } from 'src/product/services/product.service';
import { IOrdersService } from './interfaces/orders';

@Injectable()
export class OrdersService implements IOrdersService {
  constructor(
    @Inject(Services.PRODUCTS) private readonly productService: ProductService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    return await this.orderRepository.save({ ...createOrderDto });
  }

  async createMultiple({ listOrder, infoOrders }: CreateMultipleOrderDto) {
    // const orders = infoOrders.map((order) => (order['listOrder'] = listOrder));
    // return await this.orderRepository.insert(orders);
  }

  async findAll(listOrderId: string): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { listOrder: { id: listOrderId } },
      relations: ['product', 'productAttribute'],
    });
  }

  async findOne(id: number): Promise<Order> {
    return await this.orderRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<UpdateResult> {
    return await this.orderRepository.update({ id }, { ...updateOrderDto });
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.orderRepository.delete({ id });
  }

  async removeAll(listOrderId: string): Promise<DeleteResult> {
    return await this.orderRepository.delete({
      listOrder: { id: listOrderId },
    });
  }
}
