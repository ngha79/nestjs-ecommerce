import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { CreateFollowUserDto } from './dto/create-follow-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FollowsUser } from 'src/entities/followsUser.entity';
import { DeleteResult, InsertResult, Like, Repository } from 'typeorm';
import { Services } from 'src/utils/constants';
import { UserService } from 'src/user/services/user.service';

import { ResultDataSearch, ResultTotalFollow } from 'src/utils/types';
import { FindAllUserFollow } from './dto/find-all-user-follow.dto';
import { User } from 'src/entities/user.entity';
import { Shop } from 'src/entities/shop.entity';

@Injectable()
export class FollowUsersService {
  constructor(
    @InjectRepository(FollowsUser)
    private readonly followsUserRepository: Repository<FollowsUser>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,
    @Inject(forwardRef(() => Services.USERS))
    private readonly userService: UserService,
  ) {}

  async create(
    userId: string,
    createFollowUserDto: CreateFollowUserDto,
  ): Promise<InsertResult> {
    const user = await this.userService.findUserById(userId);
    if (!user) throw new UnauthorizedException('User not found!');
    const userFollow = await this.userService.findUserById(
      createFollowUserDto.followId,
    );
    if (!userFollow)
      throw new UnauthorizedException('User you follow not found!');
    return await this.followsUserRepository
      .createQueryBuilder()
      .insert()
      .into(FollowsUser)
      .values({
        user: user,
        userFollow: userFollow,
      })
      .execute();
  }

  async unfollow(
    userId: string,
    { followId }: CreateFollowUserDto,
  ): Promise<DeleteResult> {
    return await this.followsUserRepository.delete({
      user: { id: userId },
      userFollow: { id: followId },
    });
  }

  async getTotalFollowerAndFollowingUser(
    userId: string,
  ): Promise<ResultTotalFollow> {
    const user = await this.userService.findUserById(userId);
    if (!user) throw new BadRequestException('User notfound!');

    const followers = await this.followsUserRepository.countBy({
      user: { id: userId },
    });
    const following = await this.followsUserRepository.countBy({
      userFollow: { id: userId },
    });
    return { following, followers };
  }

  async getTotalFollowerAndFollowingShop(
    shopId: string,
  ): Promise<ResultTotalFollow> {
    const shop = await this.shopRepository.findOneBy({ id: shopId });
    if (!shop) throw new BadRequestException('Shop not found!');
    const followers = await this.followsUserRepository.countBy({
      user: { id: shopId },
    });
    const following = await this.followsUserRepository.countBy({
      userFollow: { id: shopId },
    });
    return { following, followers };
  }

  async findAll(
    findAllUserFollow: FindAllUserFollow,
  ): Promise<ResultDataSearch> {
    const limit = +findAllUserFollow.limit;
    const page = +findAllUserFollow.page;
    const skip = (page - 1) * limit;
    const user = await this.userService.findUserById(findAllUserFollow.userId);
    if (!user) throw new BadRequestException('User not found!');
    const [res, total] = await this.userRepository.findAndCount({
      where: {
        // following: findAllUserFollow.userId,
        userName: Like(findAllUserFollow.search),
      },
      skip: skip,
      take: limit,
      select: ['avatar', 'background', 'userName'],
    });
    const lastPage = Math.floor(total / limit);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;
    return {
      data: res,
      lastPage,
      nextPage,
      prevPage,
    };
  }

  async findOne(id: string) {
    return await this.userService.findUserById(id);
  }
}
