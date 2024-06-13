import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBlogDto, CreateTopicDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from 'src/entities/blog.entity';
import { Like, Repository } from 'typeorm';
import { FindBlogDto } from './dto/find-blog.dto';
import { IBlogService } from './interfaces/blog';
import { TopicBlog } from 'src/entities/topic.entity';
import { UpdateTopicDto } from './dto/update-topic.dto';

@Injectable()
export class BlogService implements IBlogService {
  constructor(
    @InjectRepository(TopicBlog)
    private readonly topicRepo: Repository<TopicBlog>,
    @InjectRepository(BlogEntity)
    private readonly blogRepo: Repository<BlogEntity>,
  ) {}

  async createTopic(createTopicDto: CreateTopicDto): Promise<TopicBlog> {
    const checkTopic = await this.findOneTopic(createTopicDto.topic);
    if (checkTopic)
      throw new BadRequestException('Đã thêm chủ đề này trước đó rồi.');
    return await this.topicRepo.save(createTopicDto);
  }

  async createBlog(createBlogDto: CreateBlogDto) {
    return await this.blogRepo.save({
      ...createBlogDto,
    });
  }

  async findAllBlog(findBlogDto: FindBlogDto) {
    const { author, search, topic } = findBlogDto;
    const page = +findBlogDto.page;
    const limit = +findBlogDto.limit;
    const [res, total] = await this.blogRepo.findAndCount({
      where: [
        {
          author,
          topic: { topic },
          title: Like(`%${search}%`),
        },
      ],
      relations: ['topic'],
    });
    const lastPage = Math.ceil(total / limit);
    const nextPage = page >= lastPage ? null : page + 1;
    const prevPage = page <= 1 ? null : page - 1;
    return {
      data: res,
      lastPage,
      curPage: page,
      nextPage,
      prevPage,
    };
  }

  async findAllTopic() {
    const topicsWithBlogCount = await this.topicRepo
      .createQueryBuilder('topicBlog')
      .leftJoinAndSelect('topicBlog.blog', 'blog')
      .select('topicBlog.topic', 'topic')
      .addSelect('topicBlog.id', 'id')
      .addSelect('COUNT(blog.id)', 'blogCount')
      .groupBy('topicBlog.topic')
      .getRawMany();
    return topicsWithBlogCount;
  }

  async findOneTopic(topic: string) {
    return await this.topicRepo.findOne({ where: { topic } });
  }

  async findOneBlog(id: string) {
    return await this.blogRepo.findOne({
      where: { id },
      relations: ['topic'],
    });
  }

  async updateBlog(id: string, updateBlogDto: UpdateBlogDto) {
    return await this.blogRepo.save({ id, ...updateBlogDto });
  }

  async updateTopic(id: number, updateTopicDto: UpdateTopicDto) {
    return await this.topicRepo.save({ id, ...updateTopicDto });
  }

  async removeTopic(id: number) {
    return await this.topicRepo.delete({ id });
  }

  async removeBlog(id: string) {
    return await this.blogRepo.delete({ id });
  }
}
