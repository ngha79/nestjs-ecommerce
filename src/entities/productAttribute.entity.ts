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
import { Product } from './product.entity';
import { Inventory } from './inventories.entity';

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

  @ManyToOne(() => Product, (product) => product.attributes)
  @JoinColumn()
  product: Product;

  @OneToOne(() => Inventory, (inventory) => inventory, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  inventory: Inventory;
}
