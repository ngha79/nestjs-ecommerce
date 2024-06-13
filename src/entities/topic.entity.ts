import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BlogEntity } from './blog.entity';

@Entity('topic-blog')
export class TopicBlog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  topic: string;

  @OneToMany(() => BlogEntity, (blog) => blog.topic, { cascade: true })
  blog: BlogEntity[];
}
