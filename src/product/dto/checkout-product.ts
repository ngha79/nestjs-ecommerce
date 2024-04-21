import { Address } from 'src/entities/address.entity';
import { ProductAttribute } from 'src/entities/productAttribute.entity';

export interface ICheckOutProduct {
  cartId?: string;
  userId: string;
  address?: Address;
  shop_order_ids: ProductOrder[];
}

export interface ICheckOut {
  cartId?: string;
  userId: string;
  address?: Address;
  shop_order_ids: ProductOrderCheckout[];
}

export interface ProductOrder {
  shopId: string;
  shop_discounts: string;
  item_products: ItemProduct[];
}

export interface ProductOrderCheckout {
  shopId: string;
  shop_discounts: string;
  item_products: ItemProductCheckout[];
}

export interface ItemProduct {
  productAttribute: ProductAttribute;
  quantity: number;
  price: number;
}

export interface ItemProductCheckout {
  productAttribute: number;
  quantity: number;
  price: number;
}
