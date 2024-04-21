import { Product } from 'src/entities/product.entity';
import { Shop } from 'src/entities/shop.entity';

export class CreateProductImage {
  product_image_url: string;
  product_thumb: string;
  image_id: string;
  shop: Shop;
  product: Product;
}

export interface QuerySearchImageProduct {
  page: string;
  limit: string;
}

export class UpdateProductImage {
  product_image_url: string;
  product_thumb: string;
  image_id: string;
}
