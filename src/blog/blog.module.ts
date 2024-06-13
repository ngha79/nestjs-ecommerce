import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from 'src/entities/blog.entity';
import { TopicBlog } from 'src/entities/topic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TopicBlog, BlogEntity])],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
