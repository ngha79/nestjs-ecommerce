import { Cart } from 'src/entities/cart.entity';
import { ProductAttribute } from 'src/entities/productAttribute.entity';

export class CreateCartItemDto {
  product: ProductAttribute;
  total_product: number;
  cart: Cart;
}
