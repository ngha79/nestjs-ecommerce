import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/entities/user.entity';
import { CartItems } from './cartItem.entity';

@Entity('cart')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user, { createForeignKeyConstraints: false })
  @JoinColumn()
  user: User;

  @OneToMany(() => CartItems, (cartItems) => cartItems.cart, { cascade: true })
  @JoinColumn()
  cartItems: CartItems[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
