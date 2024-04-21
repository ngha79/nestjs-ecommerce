import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ListOrder } from './listOrder.entity';
import { DiscountUserUsed } from './discountUserUsed.entity';
import { Shop } from './shop.entity';

export enum DiscountType {
  PERCENT = 'percent',
  VALUE = 'value',
}

export enum DiscountApplyType {
  ALL = 'all',
  SPECIFIC = 'specific',
}

@Entity('discount')
export class Discount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  discount_name: string;

  @Column()
  discount_description: string;

  @Column({
    unique: true,
  })
  discount_code: string;

  @Column({
    type: 'enum',
    enum: DiscountType,
    default: DiscountType.PERCENT,
  })
  discount_type: DiscountType;

  @Column()
  discount_value: number;

  @Column()
  discount_start_date: Date;

  @Column()
  discount_end_date: Date;

  @Column()
  discount_max_uses: number;

  @Column()
  discount_max_value: number;

  @Column({ default: 0 })
  discount_use_count: number;

  @Column({ default: 1 })
  discount_uses_per_user: number;

  @OneToOne(() => Shop, (shop) => shop, { createForeignKeyConstraints: false })
  @JoinColumn()
  discount_shop: Shop;

  @Column()
  discount_min_order_value: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  discount_is_active: boolean;

  @OneToMany(() => Product, (product) => product)
  @JoinColumn()
  discount_product_apply_to?: Product[];

  @Column({
    type: 'enum',
    enum: DiscountApplyType,
    default: DiscountApplyType.ALL,
  })
  discount_apply_type: DiscountApplyType;

  @OneToMany(() => DiscountUserUsed, (user) => user)
  @JoinColumn()
  discount_user_used: DiscountUserUsed[];

  @OneToMany(() => ListOrder, (listOrder) => listOrder.discounts)
  @JoinColumn()
  discount_listOrder: ListOrder;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
