import { Address } from 'src/entities/address.entity';
import { ProductAttribute } from 'src/entities/productAttribute.entity';
import { ItemProduct } from 'src/product/dto/checkout-product';

export class CreateListOrderDto {
  productIds: ItemProduct[];
  userId: string;
  codeId: string;
  address: Address;
  shopId: string;
}

export interface ICreateListOrders {
  cartId?: string;
  userId: string;
  address?: Address;
  shop_order_ids_new: ProductOrderNew[];
  shop_order_ids: ProductOrder[];
  checkout_order: {
    feeShip: number;
    totalCheckout: number;
    totalDiscount: number;
    total_price: number;
  };
}

export interface ProductOrderNew {
  shop: {
    id: string;
  };
  shop_discounts: string;
  item_products: ItemProductOrderNew[];
}

export interface ProductOrder {
  shopId: string;
  shop_discounts: string;
  item_products: ItemProductOrder[];
}

export interface ItemProductOrderNew {
  productAttribute: ProductAttribute;
  quantity: number;
  price: number;
}

export interface ItemProductOrder {
  productAttribute: number;
  product: string;
  quantity: number;
  price: number;
}
