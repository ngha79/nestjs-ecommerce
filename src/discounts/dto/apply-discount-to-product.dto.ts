import { ItemProduct } from 'src/product/dto/checkout-product';

export class ApplyDiscountCode {
  codeId: string;
  userId: string;
  shopId: string;
  products: ItemProduct[];
}
