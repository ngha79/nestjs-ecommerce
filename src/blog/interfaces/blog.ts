import { BlogEntity } from 'src/entities/blog.entity';
import { CreateBlogDto, CreateTopicDto } from '../dto/create-blog.dto';
import { FindBlogDto } from '../dto/find-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { UpdateTopicDto } from '../dto/update-topic.dto';
import { DeleteResult } from 'typeorm';
import { TopicBlog } from 'src/entities/topic.entity';

export interface IBlogService {
  createBlog(createBlogDto: CreateBlogDto): Promise<BlogEntity>;
  createTopic(createTopicDto: CreateTopicDto): Promise<TopicBlog>;
  findAllBlog(findBlogDto: FindBlogDto): Promise<any>;
  findAllTopic(): Promise<any[]>;
  findOneBlog(id: string): Promise<BlogEntity | undefined>;
  updateBlog(
    id: string,
    updateBlogDto: UpdateBlogDto,
  ): Promise<BlogEntity | undefined>;
  updateTopic(
    id: number,
    updateTopicDto: UpdateTopicDto,
  ): Promise<TopicBlog | undefined>;
  removeTopic(id: number): Promise<DeleteResult>;
  removeBlog(id: string): Promise<DeleteResult>;
}
