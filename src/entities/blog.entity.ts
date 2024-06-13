import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TopicBlog } from './topic.entity';

@Entity('blog')
export class BlogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  author: string;

  @Column()
  title: string;

  @ManyToOne(() => TopicBlog, (topic) => topic.blog, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  topic: TopicBlog;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
