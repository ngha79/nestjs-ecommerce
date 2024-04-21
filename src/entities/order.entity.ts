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

  @ManyToOne(() => ListOrder, (listOrder) => listOrder.order)
  @JoinColumn()
  listOrder: ListOrder;

  @OneToOne(() => Product, (product) => product, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  product: Product;

  @OneToOne(() => ProductAttribute, (product) => product, {
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
