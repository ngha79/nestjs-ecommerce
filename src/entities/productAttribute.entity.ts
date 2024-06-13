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
import { Product } from './product.entity';
import { Inventory } from './inventories.entity';
import { CartItems } from './cartItem.entity';

@Entity('product_attribute')
export class ProductAttribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  picture: string;

  @Column()
  thumb: string;

  @Column()
  size: string;

  @Column()
  material: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Product, (product) => product.attributes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  product: Product;

  @OneToMany(() => CartItems, (cartItems) => cartItems.productAttribute, {
    cascade: true,
  })
  cartItems: CartItems;

  @OneToOne(() => Inventory, (inventory) => inventory, {
    cascade: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  inventory: Inventory;
}
