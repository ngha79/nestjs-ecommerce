import { ItemProduct } from 'src/product/dto/checkout-product';

export class ApplyDiscountCode {
  codeId: string;
  id: string;
  shopId: string;
  products: ItemProduct[];
}
