import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { ProductAttribute } from './productAttribute.entity';

@Entity('cart-items')
export class CartItems {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total_product: number;

  @ManyToOne(() => ProductAttribute, (product) => product, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  productAttribute: ProductAttribute;

  @ManyToOne(() => Cart, (cart) => cart.cartItems, { onDelete: 'CASCADE' })
  @JoinColumn()
  cart: Cart;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
