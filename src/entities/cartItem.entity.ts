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
import { Cart } from './cart.entity';
import { ProductAttribute } from './productAttribute.entity';

@Entity('cart-items')
export class CartItems {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total_product: number;

  @OneToOne(() => ProductAttribute, (product) => product, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  productAttribute: ProductAttribute;

  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  @JoinColumn()
  cart: Cart;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
