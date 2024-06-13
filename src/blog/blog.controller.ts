import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto, CreateTopicDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { FindBlogDto } from './dto/find-blog.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  createBlog(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.createBlog(createBlogDto);
  }

  @Post('topic')
  createTopic(@Body() createTopicDto: CreateTopicDto) {
    return this.blogService.createTopic(createTopicDto);
  }

  @Get('topic')
  findAllTopic() {
    return this.blogService.findAllTopic();
  }

  @Get()
  findAllBlog(@Query() findBlogDto: FindBlogDto) {
    return this.blogService.findAllBlog(findBlogDto);
  }

  @Get(':id')
  findOneBlog(@Param('id') id: string) {
    return this.blogService.findOneBlog(id);
  }

  @Delete(':id')
  removeBlog(@Param('id') id: string) {
    return this.blogService.removeBlog(id);
  }

  @Delete('topic/:id')
  removeTopic(@Param('id') id: string) {
    return this.blogService.removeTopic(+id);
  }

  @Put(':id')
  updateBlog(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.updateBlog(id, updateBlogDto);
  }

  @Put('topic/:id')
  updateTopic(@Param('id') id: string, @Body() updateTopicDto: UpdateTopicDto) {
    return this.blogService.updateTopic(+id, updateTopicDto);
  }
}
