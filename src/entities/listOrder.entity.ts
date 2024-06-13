import { User } from 'src/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Discount } from './discount.entity';
import { Shop } from './shop.entity';
import { Address } from './address.entity';

export enum StatusOrder {
  CONFIRMED = 'confirmed',
  PENDING = 'pending',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  SHIPPING = 'shipping',
}

@Entity('list_order')
export class ListOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @OneToOne(() => Address, (address) => address, {
    createForeignKeyConstraints: false,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  address: Address;

  @Column()
  total_price: number;

  @Column()
  total_price_apply_discount: number;

  @Column()
  tracking_number: string;

  @Column({
    type: 'enum',
    enum: StatusOrder,
    default: StatusOrder.PENDING,
  })
  status: StatusOrder;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Order, (order) => order.listOrder, { cascade: true })
  @JoinColumn()
  order: Order[];

  @OneToOne(() => Discount, (discount) => discount.discount_listOrder, {
    onDelete: 'SET NULL',
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  discount: Discount;

  @ManyToOne(() => Shop, (shop) => shop.orders, { onDelete: 'SET NULL' })
  @JoinColumn()
  shop: Shop;
}
