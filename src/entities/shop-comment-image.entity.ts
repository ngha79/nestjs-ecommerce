import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Shop } from './shop.entity';
import { ShopComment } from './shop-comment.entity';

@Entity('shop_comment_image')
export class ShopCommentImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Shop, (shop) => shop)
  @JoinColumn()
  shop: Shop;

  @Column()
  image_url: string;

  @Column()
  image_id: string;

  @ManyToOne(() => ShopComment, (comment) => comment.images)
  @JoinColumn()
  comment: ShopComment;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
