import { ListOrder } from 'src/entities/listOrder.entity';
import {
  CreateListOrderDto,
  ICreateListOrders,
} from '../dto/create-list-order.dto';
import { QuerySearchOrder } from '../dto/query-search-order.dto';
import { DeleteResult } from 'typeorm';
import { UpdateListOrderDto } from '../dto/update-list-order.dto';

export interface IListOrdersService {
  createListOrder(createListOrders: ICreateListOrders): Promise<any>;
  create(createListOrderDto: CreateListOrderDto): Promise<ListOrder>;
  acquireLock(
    productId: number,
    quantity: number,
    order?: ListOrder,
  ): Promise<any>;
  releaseLock(keyLock: string): Promise<void>;
  findAll(querySearchOrder: QuerySearchOrder): Promise<any>;
  findOne(id: string): Promise<ListOrder>;
  findOneDetail(id: number): Promise<ListOrder>;
  updateStatus(
    id: string,
    updateListOrderDto: UpdateListOrderDto,
  ): Promise<ListOrder>;
  update(
    listOrder: ListOrder,
    updateListOrderDto: UpdateListOrderDto,
  ): Promise<ListOrder>;
  remove(id: string): Promise<DeleteResult>;
}
