import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { DeleteResult, Like, Repository } from 'typeorm';
import { PayloadToken } from 'src/auth/dto/payload-token.dto';
import { UpdateUser } from '../dto/update-user.dto';
import { SearchUsers } from '../dto/search-users.dto';
import { Address } from 'src/entities/address.entity';
import { Services } from 'src/utils/constants';
import { FollowUsersService } from 'src/follow-users/follow-users.service';
import { ProfileUser } from 'src/utils/types';
import { Product } from 'src/entities/product.entity';
import { IUserService } from '../interfaces/user';
import { Shop } from 'src/entities/shop.entity';
import { IChangePassword } from '../dto/change-password';
import { compareHash, hashPassword } from 'src/utils/helper';
import { ICreateUser } from '../dto/create-user.dto';
import { Cart } from 'src/entities/cart.entity';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Shop) private readonly shopRepository: Repository<Shop>,
    @InjectRepository(Cart) private readonly cartRepo: Repository<Cart>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @Inject(forwardRef(() => Services.FOLLOW_USERS))
    private readonly followsService: FollowUsersService,
  ) {}

  async createUser(createUser: ICreateUser): Promise<User> {
    const checkEmail = await this.findUserByEmail(createUser.email);
    if (checkEmail) {
      throw new BadRequestException('Email đã được sử dụng!');
    }
    const passwordHash = await hashPassword(createUser.password);
    const newUser = await this.userRepository.save({
      ...createUser,
      password: passwordHash,
    });
    if (newUser) await this.cartRepo.save({ cartItems: [], user: newUser });
    return newUser;
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email: email });
  }

  async getProfileUser(user: PayloadToken): Promise<User> {
    return await this.userRepository.findOne({
      where: { id: user.userId },
      select: [
        'id',
        'email',
        'userName',
        'address',
        'avatar',
        'background',
        'createdAt',
        'phoneNumber',
      ],
    });
  }

  async updateProfileUser(
    userId: string,
    updateUser: UpdateUser,
  ): Promise<User> {
    return await this.userRepository.save({ id: userId, ...updateUser });
  }

  async updateAvatarUser(userId: string, update: object): Promise<User> {
    return await this.userRepository.save({ id: userId, ...update });
  }

  async findUserById(userId: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { id: userId },
      select: [
        'email',
        'userName',
        'address',
        'avatar',
        'background',
        'createdAt',
        'phoneNumber',
        'id',
      ],
    });
  }

  async findUser(userId: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { id: userId },
      select: ['avatar', 'background', 'email', 'userName', 'id'],
    });
  }

  async deleteUserById(userId: string): Promise<DeleteResult> {
    return await this.userRepository.delete({ id: userId });
  }

  async findAllUser(querySearch: SearchUsers): Promise<any> {
    const limit = Number(querySearch.limit) || 20;
    const page = Number(querySearch.page) || 1;
    const skip = (page - 1) * limit;
    const [res, total] = await this.userRepository.findAndCount({
      where: [
        { userName: Like('%' + querySearch.search + '%') },
        { email: Like('%' + querySearch.search + '%') },
      ],
      select: [
        'email',
        'userName',
        'avatar',
        'background',
        'createdAt',
        'phoneNumber',
        'id',
      ],
      take: limit,
      skip: skip,
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

  async checkShopIsActive(shopId: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { id: shopId },
      select: ['avatar', 'background', 'userName', 'id'],
    });
  }

  async getShop(shopId: string): Promise<ProfileUser> {
    const follow = await this.followsService.getTotalFollowerAndFollowingUser(
      shopId,
    );
    return {
      user: await this.userRepository.findOne({
        where: { id: shopId },
      }),
      ...follow,
    };
  }

  async findProfileUser(id: string): Promise<any> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.comment', 'comment')
      .leftJoinAndSelect('user.following', 'following')
      .select([
        'user.userName',
        'user.avatar',
        'user.background',
        'user.createdAt',
        'COUNT(comment.id) AS totalCommentCount',
        'COUNT(following.id) AS followingCount',
      ])
      .where('user.id = :id', { id })
      .groupBy('user.id')
      .getRawOne();
    return user;
  }

  async findShopByProduct(productId: string): Promise<any> {
    const shop = await this.shopRepository
      .createQueryBuilder('shop')
      .leftJoinAndSelect('shop.products', 'product')
      .leftJoinAndSelect('shop.followers', 'followers')
      .leftJoinAndSelect('shop.likeProduct', 'likeProduct')
      .leftJoinAndSelect('product.comment', 'comment')
      .select([
        'shop',
        'COUNT(product.id) AS productCount',
        'COUNT(followers.id) AS followersCount',
        'COUNT(likeProduct.id) AS totalLikeCount',
        'COUNT(comment.id) AS totalCommentCount',
      ])
      .where('product.id = :id', { id: productId })
      .groupBy('shop.id')
      .getRawOne();
    const { shop_password, shop_role, shop_phoneNumber, ...result } = shop;
    return result;
  }

  async changePassword(
    userId: string,
    changePassword: IChangePassword,
  ): Promise<any> {
    const { confirmPassword, currentPassword, newPassword } = changePassword;
    if (confirmPassword !== newPassword) {
      throw new BadRequestException('Mật khẩu không trùng khớp.');
    }
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng!');
    const comparePassword = await compareHash(currentPassword, user.password);
    if (!comparePassword)
      throw new BadRequestException('Mật khẩu không chính xác.');

    const passwordHash = await hashPassword(newPassword);

    const update = await this.userRepository.save({
      id: userId,
      password: passwordHash,
    });
    if (!update) throw new BadRequestException('Cập nhật mật khẩu thất bại.');
    return { message: 'Cập nhật mật khẩu thành công.' };
  }
}
