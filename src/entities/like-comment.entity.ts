import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Shop } from './shop.entity';
import { Comment } from './comment.entity';
import { ShopComment } from './shop-comment.entity';

@Entity('like_product')
export class LikeComment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user)
  user: User;

  @ManyToOne(() => Shop, (shop) => shop)
  shop: Shop;

  @ManyToOne(() => Comment, (comment) => comment.likeComment)
  comment: Comment;

  @ManyToOne(() => ShopComment, (shopComment) => shopComment.likeComment)
  shopComment: ShopComment;
}
