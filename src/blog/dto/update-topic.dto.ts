import { PartialType } from '@nestjs/swagger';
import { CreateTopicDto } from './create-blog.dto';

export class UpdateTopicDto extends PartialType(CreateTopicDto) {}
