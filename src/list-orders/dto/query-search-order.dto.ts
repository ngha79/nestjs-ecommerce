import { StatusOrder } from 'src/entities/listOrder.entity';

export class QuerySearchOrder {
  page: number | 1;
  limit: number | 20;
  search?: string;
  userId?: string;
  shopId?: string
  status?: StatusOrder;
}
