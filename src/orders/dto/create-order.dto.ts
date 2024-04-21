import { ListOrder } from 'src/entities/listOrder.entity';
import { Product } from 'src/entities/product.entity';
import { ProductAttribute } from 'src/entities/productAttribute.entity';

export class InfoOrder {
  product: Product;
  productAttribute: ProductAttribute;
  quantity: number;
}

export class CreateOrderDto extends InfoOrder {
  listOrder: ListOrder;
}

export class CreateMultipleOrderDto {
  infoOrders: InfoOrder[];
  listOrder: ListOrder;
}
