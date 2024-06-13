import {
  Controller,
  Get,
  Post,
  Body,
  Inject,
  Query,
  Param,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { FollowUsersService } from './follow-users.service';
import { CreateFollowUserDto } from './dto/create-follow-user.dto';
import { Services } from 'src/utils/constants';
import { UserRequest } from 'src/user/user.decorator';
import { PayloadToken } from 'src/auth/dto/payload-token.dto';
import { DeleteResult, InsertResult } from 'typeorm';
import { FindAllUserFollow } from './dto/find-all-user-follow.dto';
import { ResultDataSearch } from 'src/utils/types';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('follow-users')
export class FollowUsersController {
  constructor(
    @Inject(Services.FOLLOW_USERS)
    private readonly followUsersService: FollowUsersService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @UserRequest() user: PayloadToken,
    @Body() createFollowUserDto: CreateFollowUserDto,
  ): Promise<InsertResult> {
    return this.followUsersService.create(user.id, createFollowUserDto);
  }

  @Delete()
  @UseGuards(AuthGuard)
  unfollow(
    @UserRequest() user: PayloadToken,
    @Body() createFollowUserDto: CreateFollowUserDto,
  ): Promise<DeleteResult> {
    return this.followUsersService.unfollow(user.id, createFollowUserDto);
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

  @Get(':shopId')
  @UseGuards(AuthGuard)
  async checkIsFollow(
    @Param('shopId') shopId: string,
    @UserRequest() user: PayloadToken,
  ) {
    const follow = await this.followUsersService.findOneByUser(user.id, shopId);
    return follow ? true : false;
  }
}
