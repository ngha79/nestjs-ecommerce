import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Shop } from './shop.entity';
import { ShopCommentImage } from './shop-comment-image.entity';
import { Comment } from './comment.entity';
import { LikeComment } from './like-comment.entity';

@Entity('shop_comment')
export class ShopComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Shop, (shop) => shop)
  @JoinColumn()
  shop: Shop;

  @ManyToOne(() => Comment, (comment) => comment)
  @JoinColumn()
  comment: Comment;

  @Column()
  content: string;

  @OneToMany(() => ShopCommentImage, (image) => image.comment)
  @JoinColumn()
  images: ShopCommentImage[];

  @OneToMany(() => LikeComment, (likeComment) => likeComment.shopComment)
  @JoinColumn()
  likeComment: LikeComment;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
