import { ListOrder } from 'src/entities/listOrder.entity';
import { ProductAttribute } from 'src/entities/productAttribute.entity';

export class UpdateOrderDto {
  productAttribute: ProductAttribute;

  listOrder: ListOrder;

  quantity: number;
}
