import { User } from 'src/entities/user.entity';
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
import { Comment } from './comment.entity';

@Entity('comment_image')
export class CommentImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user, { createForeignKeyConstraints: false })
  @JoinColumn()
  user: User;

  @Column()
  image_url: string;

  @Column()
  image_id: string;

  @ManyToOne(() => Product, (product) => product.comment)
  @JoinColumn()
  product: Product;

  @ManyToOne(() => Comment, (comment) => comment.commentImage)
  @JoinColumn()
  comment: Comment;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
