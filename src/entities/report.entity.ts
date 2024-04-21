import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { Product } from './product.entity';
import { Shop } from './shop.entity';

@Entity('report')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Comment, (comment) => comment)
  @JoinColumn()
  comment: Comment;

  @ManyToOne(() => Product, (product) => product)
  @JoinColumn()
  product: Product;

  @ManyToOne(() => Shop, (shop) => shop)
  @JoinColumn()
  shop: Shop;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
