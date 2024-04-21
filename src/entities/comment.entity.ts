import { User } from 'src/entities/user.entity';
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
import { Product } from './product.entity';
import { CommentImage } from './comment-image.entity';
import { ShopComment } from './shop-comment.entity';
import { LikeComment } from './like-comment.entity';

@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.comment)
  @JoinColumn()
  user: User;

  @OneToMany(() => CommentImage, (image) => image.comment)
  @JoinColumn()
  commentImage: CommentImage[];

  @Column()
  content: string;

  @OneToMany(() => ShopComment, (shopComment) => shopComment.comment)
  @JoinColumn()
  shopComment: ShopComment[];

  @Column()
  rating: number;

  @ManyToOne(() => Product, (product) => product.comment)
  @JoinColumn()
  product: Product;

  @OneToMany(() => LikeComment, (likeComment) => likeComment.comment)
  @JoinColumn()
  likeComment: LikeComment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
