import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ListOrder } from './listOrder.entity';
import { ProductAttribute } from './productAttribute.entity';
import { Product } from './product.entity';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ListOrder, (listOrder) => listOrder.order, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  listOrder: ListOrder;

  @OneToOne(() => Product, {
    createForeignKeyConstraints: false,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  product: Product;

  @OneToOne(() => ProductAttribute, {
    onDelete: 'SET NULL',
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  productAttribute: ProductAttribute;

  @Column()
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
