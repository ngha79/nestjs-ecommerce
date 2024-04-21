import { DiscountType } from 'src/entities/discount.entity';
import { Product } from 'src/entities/product.entity';
import { Shop } from 'src/entities/shop.entity';

export class CreateDiscountDto {
  discount_name: string;

  discount_description: string;

  discount_code: string;

  discount_type: DiscountType;

  discount_value: number;

  discount_start_date: Date;

  discount_end_date: Date;

  discount_max_uses: number;

  discount_max_value: number;

  discount_use_count: number;

  discount_uses_per_user: number;

  discount_shop: Shop;

  discount_min_order_value: number;

  discount_is_active: boolean;

  discount_product_apply_to?: Product[];
}
