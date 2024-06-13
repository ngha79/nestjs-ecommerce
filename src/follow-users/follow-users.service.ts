import {
  BadRequestException,
  Inject,
  Injectable,
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
    id: string,
    createFollowUserDto: CreateFollowUserDto,
  ): Promise<InsertResult> {
    const checkIsFollow = await this.findOneByUser(
      id,
      createFollowUserDto.followId,
    );
    if (checkIsFollow)
      throw new BadRequestException('Bạn đã theo dõi người dùng này rồi.');
    return await this.followsUserRepository
      .createQueryBuilder()
      .insert()
      .into(FollowsUser)
      .values({
        user: {
          id: id,
        },
        userFollow: {
          id: createFollowUserDto.followId,
        },
      })
      .execute();
  }

  async findOneByUser(id: string, followId: string): Promise<FollowsUser> {
    return await this.followsUserRepository.findOneBy({
      user: { id: id },
      userFollow: { id: followId },
    });
  }

  async unfollow(
    id: string,
    { followId }: CreateFollowUserDto,
  ): Promise<DeleteResult> {
    return await this.followsUserRepository.delete({
      user: { id: id },
      userFollow: { id: followId },
    });
  }

  async getTotalFollowerAndFollowingUser(
    id: string,
  ): Promise<ResultTotalFollow> {
    const user = await this.userService.findUserById(id);
    if (!user) throw new BadRequestException('User notfound!');

    const followers = await this.followsUserRepository.countBy({
      user: { id: id },
    });
    const following = await this.followsUserRepository.countBy({
      userFollow: { id: id },
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
    const user = await this.userService.findUserById(findAllUserFollow.id);
    if (!user) throw new BadRequestException('User not found!');
    const [res, total] = await this.userRepository.findAndCount({
      where: {
        // following: findAllUserFollow.id,
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
