import { ListOrder } from 'src/entities/listOrder.entity';

export class UpdateWhenOrder {
  productId: number;
  quantity: number;
  order?: ListOrder;
}

export class UpdateWhenUpdate {
  productId: number;
  quantity: number;
  orderId: number;
}
