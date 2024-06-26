/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IShopService } from '../interfaces/shop';
import { Shop } from 'src/entities/shop.entity';
import { CreateShopDto } from '../dto/create-shop.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';
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
    @InjectDataSource() private dataSource: DataSource,
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
    const shop = await this.shopRepository.findOne({
      where: { id },
      relations: ['followers', 'address'],
    });
    if (!shop) throw new NotFoundException('Shop not found!');
    return shop;
  }

  async findShopByUser(id: string): Promise<Shop> {
    const shop = await this.shopRepository.findOne({
      where: {
        id,
      },
      relations: ['followers', 'address'],
      select: {
        id: true,
        userName: true,
        avatar: true,
        background: true,
        createdAt: true,
        description: true,
        phoneNumber: true,
      },
    });
    if (!shop) throw new NotFoundException('Shop not found!');
    return shop;
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
        'COUNT(DISTINCT product.id) AS productcount',
        'COUNT(DISTINCT followers.id) AS followerscount',
        'COUNT(DISTINCT likeProduct.id) AS totallikecount',
        'COUNT(comment.id) AS totalcommentcount',
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
      select: {
        id: true,
        userName: true,
        avatar: true,
        background: true,
      },
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
      search = '',
      page = '1',
      limit = '20',
      order = 'userName',
    } = params;
    let typeOrder = '';
    if (order === 'followers') typeOrder = 'followerscount';
    else typeOrder = `shop.${order}`;
    const take = parseInt(limit);
    const takePage = parseInt(page) - 1;
    const skip = take * takePage;
    const [res, total] = await this.shopRepository
      .createQueryBuilder('shop')
      .leftJoinAndSelect('shop.followers', 'followers')
      .where('shop.userName LIKE :query', { query: `%${search}%` })
      .orWhere('shop.email LIKE :query', { query: `%${search}%` })
      .select(['shop', ' COUNT(followers.id) as followerscount'])
      .groupBy('shop.id')
      .orderBy(typeOrder, 'ASC')
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
        'COUNT(DISTINCT product.id) AS productcount',
        'COUNT(DISTINCT followers.id) AS followerscount',
        'COUNT(DISTINCT likeProduct.id) AS totallikecount',
        'COUNT(comment.id) AS totalcommentcount',
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
    id,
    currentPassword,
    newPassword,
  }: ChangePasswordDto): Promise<Shop> {
    if (currentPassword === newPassword)
      throw new BadRequestException('Mật khẩu trùng khớp.');
    const shop = await this.findShopById(id);
    if (!shop) throw new NotFoundException('Shop không tồn tại.');
    if (shop.isActive === 'band')
      throw new BadRequestException('Shop bị cấm hoạt động.');
    const isChecked = await compareHash(currentPassword, shop.password);
    if (!isChecked) throw new BadRequestException('Mật khẩu không chính xác.');
    const passwordHash = await hashPassword(newPassword);
    const resposne = await this.shopRepository.save({
      ...shop,
      password: passwordHash,
    });
    return resposne;
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

  async getShopSalesInMonth(shopId: string) {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const query = `
    SELECT
        COUNT(DISTINCT lo.id) AS total_orders,
        SUM(lo.total_price) AS total_revenue,
        COUNT(DISTINCT p.id) AS new_products,
        COUNT(DISTINCT u.id) AS total_customers
    FROM
        shop s
    LEFT JOIN
        list_order lo ON s.id = lo."shopId"
    LEFT JOIN
        "order" o ON lo.id = o."listOrderId"
    LEFT JOIN
        product p ON o."productId" = p.id
    LEFT JOIN
        "user" u ON lo.id = u.id
    WHERE
        s.id = $1
        AND EXTRACT(MONTH FROM lo."createdAt") = $2
        AND EXTRACT(YEAR FROM lo."createdAt") = $3
    `;

    const result = await this.dataSource.query(query, [shopId, month, year]);
    return result[0];
  }
}
