import { PartialType } from '@nestjs/swagger';
import { CreateFollowUserDto } from './create-follow-user.dto';

export class UpdateFollowUserDto extends PartialType(CreateFollowUserDto) {}
