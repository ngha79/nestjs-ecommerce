import { User } from 'src/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Discount } from './discount.entity';

@Entity('discount_user_used')
export class DiscountUserUsed {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user, { createForeignKeyConstraints: false })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Discount, (discount) => discount)
  discount: Discount;

  @Column()
  total_used: number;
}
