import {
  Controller,
  Get,
  Post,
  Body,
  Inject,
  Query,
  Param,
} from '@nestjs/common';
import { FollowUsersService } from './follow-users.service';
import { CreateFollowUserDto } from './dto/create-follow-user.dto';
import { Services } from 'src/utils/constants';
import { UserRequest } from 'src/user/user.decorator';
import { PayloadToken } from 'src/auth/dto/payload-token.dto';
import { InsertResult } from 'typeorm';
import { FindAllUserFollow } from './dto/find-all-user-follow.dto';
import { ResultDataSearch } from 'src/utils/types';

@Controller('follow-users')
export class FollowUsersController {
  constructor(
    @Inject(Services.FOLLOW_USERS)
    private readonly followUsersService: FollowUsersService,
  ) {}

  @Post()
  create(
    @UserRequest() user: PayloadToken,
    @Body() createFollowUserDto: CreateFollowUserDto,
  ): Promise<InsertResult> {
    return this.followUsersService.create(user.userId, createFollowUserDto);
  }

  @Get()
  findAll(
    @Query() findAllUserFollow: FindAllUserFollow,
  ): Promise<ResultDataSearch> {
    return this.followUsersService.findAll(findAllUserFollow);
  }

  @Get('shop/:shopId')
  getTotalFollowerAndFollowingShop(
    @Param('shopId') shopId: string,
  ): Promise<any> {
    return this.followUsersService.getTotalFollowerAndFollowingShop(shopId);
  }
}
