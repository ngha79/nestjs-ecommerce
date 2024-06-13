import { TopicBlog } from 'src/entities/topic.entity';

export class CreateBlogDto {
  title: string;
  description: string;
  author: string;
  topic: TopicBlog;
}

export class CreateTopicDto {
  topic: string;
}
