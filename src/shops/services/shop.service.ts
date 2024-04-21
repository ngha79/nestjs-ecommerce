import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IShopService } from '../interfaces/shop';
import { Shop } from 'src/entities/shop.entity';
import { CreateShopDto } from '../dto/create-shop.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { compareHash, hashPassword } from 'src/utils/helper';
import { ShopAlreadyExists } from '../exceptions/ShopAlreadyExist';
import { UpdateShopDto } from '../dto/update-shop.dto';
import { FindShopParams, StatusShop } from 'src/utils/types';
import { Product } from 'src/entities/product.entity';
import { UpdateStatusShopDTO } from '../dto/update-status-shop';
import {
  ChangePasswordDto,
  ChangePasswordShopDto,
} from '../dto/change-password.dto';

@Injectable()
export class ShopService implements IShopService {
  constructor(
    @InjectRepository(Shop) private readonly shopRepository: Repository<Shop>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createShop(createShopDto: CreateShopDto): Promise<Shop> {
    const checkEmail = await this.findShopByEmail(createShopDto.email);
    if (checkEmail) {
      throw new ShopAlreadyExists();
    }
    const hash = await hashPassword(createShopDto.password);
    const newUser = await this.shopRepository.save({
      ...createShopDto,
      password: hash,
    });
    return newUser;
  }

  async createShopAdmin(createShopDto: CreateShopDto): Promise<Shop> {
    const checkEmail = await this.findShopByEmail(createShopDto.email);
    if (checkEmail) {
      throw new ShopAlreadyExists();
    }
    const hash = await hashPassword(createShopDto.password);
    const newUser = await this.shopRepository.create({
      ...createShopDto,
      password: hash,
      address: undefined,
    });
    return newUser;
  }

  async saveShop(shop: Shop): Promise<Shop> {
    return this.shopRepository.save(shop);
  }

  async findShopByEmail(email: string): Promise<Shop> {
    return await this.shopRepository.findOneBy({ email });
  }

  async findShopById(id: string): Promise<Shop> {
    return await this.shopRepository.findOne({
      where: { id },
      relations: ['followers', 'address'],
    });
  }

  async findProfileShopById(id: string): Promise<any> {
    const shop: any = await this.shopRepository
      .createQueryBuilder('shop')
      .leftJoinAndSelect('shop.products', 'product')
      .leftJoinAndSelect('shop.followers', 'followers')
      .leftJoinAndSelect('shop.likeProduct', 'likeProduct')
      .leftJoinAndSelect('product.comment', 'comment')
      .select([
        'shop',
        'COUNT(DISTINCT product.id) AS productCount',
        'COUNT(DISTINCT followers.id) AS followersCount',
        'COUNT(DISTINCT likeProduct.id) AS totalLikeCount',
        'COUNT(comment.id) AS totalCommentCount',
      ])
      .where('shop.id = :id', { id })
      .groupBy('shop.id')
      .getRawOne();
    const {
      shop_password,
      shop_role,
      shop_phoneNumber,
      shop_money,
      shop_isActive,
      ...result
    } = shop;

    return result;
  }

  async profileShop(id: string): Promise<Shop> {
    return await this.shopRepository.findOne({
      where: {
        id,
      },
      relations: ['followers', 'address'],
    });
  }

  async updateShop(shop: Shop, update: UpdateShopDto): Promise<Shop> {
    return await this.shopRepository.save({
      ...shop,
      ...update,
    });
  }

  async deleteShop(id: string): Promise<DeleteResult> {
    return await this.shopRepository.delete({ id });
  }

  async findShop(params: FindShopParams): Promise<any> {
    const {
      id,
      isActive,
      search = '',
      page = '1',
      limit = '20',
      order = 'userName',
    } = params;
    if (id) {
      return await this.shopRepository.findBy({ id: id });
    }
    let typeCount = '';
    if (order === 'followers') typeCount = 'followersCount';
    const take = parseInt(limit);
    const takePage = parseInt(page) - 1;
    const skip = take * takePage;
    const [res, total] = await this.shopRepository
      .createQueryBuilder('shop')
      .leftJoinAndSelect('shop.followers', 'followers')
      .select(['shop', ' COUNT(followers.id) as followersCount'])
      .where('shop.userName LIKE :query', { query: `%${search}%` })
      .andWhere('shop.isActive = :status', { status: isActive || undefined })
      .orWhere('shop.email LIKE :query', { query: `%${search}%` })
      .groupBy('shop.id')
      .orderBy(typeCount || order, 'ASC')
      .skip(skip)
      .limit(take)
      .getManyAndCount();
    const lastPage = Math.floor(total / take);
    const nextPage = takePage + 1 > lastPage ? null : takePage + 1;
    const prevPage = takePage - 1 < 1 ? null : takePage - 1;

    return {
      data: res,
      lastPage,
      nextPage,
      prevPage,
    };
  }

  async findShopByProduct(productId: string): Promise<Shop> {
    const shop = await this.shopRepository
      .createQueryBuilder('shop')
      .innerJoin('shop.products', 'product')
      .leftJoinAndSelect('shop.followers', 'followers')
      .leftJoinAndSelect('shop.likeProduct', 'likeProduct')
      .leftJoinAndSelect('product.comment', 'comment')
      .select([
        'shop',
        'COUNT(DISTINCT product.id) AS productCount',
        'COUNT(DISTINCT followers.id) AS followersCount',
        'COUNT(DISTINCT likeProduct.id) AS totalLikeCount',
        'COUNT(comment.id) AS totalCommentCount',
      ])
      .where('product.id = :productId', { productId: productId })
      .groupBy('shop.id')
      .getRawOne();
    const { shop_password, shop_role, shop_phoneNumber, ...result } = shop;

    return result;
  }

  async checkShopIsActive(shopId: string): Promise<Shop> {
    return await this.shopRepository.findOne({
      where: {
        id: shopId,
        isActive: StatusShop.ACTIVE,
      },
      select: [
        'avatar',
        'background',
        'email',
        'id',
        'phoneNumber',
        'userName',
      ],
    });
  }

  async updateStatusShop({
    shopId,
    status,
  }: UpdateStatusShopDTO): Promise<UpdateResult> {
    return await this.shopRepository.update(
      { id: shopId },
      { isActive: status },
    );
  }

  async changePassword({
    userId,
    currentPassword,
    newPassword,
  }: ChangePasswordDto): Promise<Shop> {
    if (currentPassword === newPassword)
      throw new BadRequestException('Mật khẩu trùng khớp.');
    const shop = await this.findShopById(userId);
    if (!shop) throw new NotFoundException('Shop không tồn tại.');
    if (shop.isActive === 'band')
      throw new UnauthorizedException('Shop bị cấm hoạt động.');
    const isChecked = await compareHash(currentPassword, shop.password);
    if (!isChecked) throw new BadRequestException('Mật khẩu không chính xác.');
    const passwordHash = await hashPassword(newPassword);
    return await this.shopRepository.save({ ...shop, password: passwordHash });
  }

  async changePasswordShop({
    email,
    currentPassword,
    newPassword,
  }: ChangePasswordShopDto): Promise<Shop> {
    if (currentPassword === newPassword)
      throw new BadRequestException('Mật khẩu trùng khớp.');
    const shop = await this.findShopByEmail(email);
    if (!shop) throw new NotFoundException('Shop không tồn tại.');
    if (shop.isActive === 'band')
      throw new UnauthorizedException('Shop bị cấm hoạt động.');
    const isChecked = await compareHash(currentPassword, shop.password);
    if (!isChecked) throw new BadRequestException('Mật khẩu không chính xác.');
    const passwordHash = await hashPassword(newPassword);
    return await this.shopRepository.save({ ...shop, password: passwordHash });
  }
}
