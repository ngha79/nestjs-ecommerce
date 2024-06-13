import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Order } from './order.entity';
import { Inventory } from './inventories.entity';

@Entity('reservation')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Order, (order) => order, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  order: Order;

  @ManyToOne(() => Inventory, (inven) => inven.reservations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  inventory: Inventory;

  @Column()
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
