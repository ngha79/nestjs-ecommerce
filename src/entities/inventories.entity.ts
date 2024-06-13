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
import { Reservation } from './reservation.entity';
import { ProductAttribute } from './productAttribute.entity';
import { Product } from './product.entity';
import { Shop } from './shop.entity';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: 0,
  })
  stock: number;

  @ManyToOne(() => Shop, (shop) => shop)
  @JoinColumn()
  shop: Shop;

  @OneToOne(() => ProductAttribute, (product) => product, {
    createForeignKeyConstraints: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  productAttribute: ProductAttribute;

  @ManyToOne(() => Product, (product) => product, { onDelete: 'CASCADE' })
  @JoinColumn()
  product: Product;

  @OneToMany(() => Reservation, (reservation) => reservation, { cascade: true })
  @JoinColumn()
  reservations: Reservation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
