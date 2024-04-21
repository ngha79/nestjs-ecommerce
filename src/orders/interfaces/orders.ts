import { Order } from 'src/entities/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { DeleteResult, UpdateResult } from 'typeorm';

export interface IOrdersService {
  create(createOrderDto: CreateOrderDto): Promise<Order>;
  findAll(listOrderId: string): Promise<Order[]>;
  findOne(id: number): Promise<Order>;
  update(id: number, updateOrderDto: UpdateOrderDto): Promise<UpdateResult>;
  remove(id: number): Promise<DeleteResult>;
  removeAll(listOrderId: string): Promise<DeleteResult>;
}
