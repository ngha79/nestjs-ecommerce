import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IAdminService } from './interfaces/admin';
import { DeleteResult, Repository } from 'typeorm';
import { CreateAdminDto } from './dtos/create.dto';
import { FindAdminDto } from './dtos/finds.dto';
import { UpdateAdminDto } from './dtos/update.dto';
import { Shop } from 'src/entities/shop.entity';
import { StatusShop } from 'src/utils/types';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEcommerce } from 'src/entities/admin.entity';
import { hashPassword } from 'src/utils/helper';
import { Services } from 'src/utils/constants';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class AdminService implements IAdminService {
  constructor(
    @InjectRepository(AdminEcommerce)
    private readonly adminRepo: Repository<AdminEcommerce>,
    @InjectRepository(Shop)
    private readonly shopRepo: Repository<Shop>,
    @Inject(Services.USERS)
    private readonly userService: UserService,
  ) {}

  async createAdmin(createAdmin: CreateAdminDto): Promise<AdminEcommerce> {
    const checkEmail = await this.adminRepo.findOneBy({
      email: createAdmin.email,
    });
    if (checkEmail) throw new BadRequestException('Email đã tồn tại!');
    const hash = await hashPassword(createAdmin.password);
    const newUser = await this.adminRepo.save({
      ...createAdmin,
      password: hash,
    });
    return newUser;
  }

  async deleteAdmin(id: string): Promise<DeleteResult> {
    return await this.adminRepo.delete({ id });
  }
  async deleteShop(shopId: string): Promise<DeleteResult> {
    return await this.shopRepo.delete({ id: shopId });
  }

  async deleteUser(userId: string): Promise<DeleteResult> {
    return await this.userService.deleteUserById(userId);
  }

  async findAdmin(
    findAdminDto: FindAdminDto,
  ): Promise<AdminEcommerce[] | AdminEcommerce> {
    const { dateOfBirdth, id, limit, page, phoneNumber, userName } =
      findAdminDto;

    const skip = limit * (page - 1);
    if (id) return await this.adminRepo.findOneBy({ id });
    return this.adminRepo
      .createQueryBuilder('admin')
      .where(userName, { query: `%${userName}%` })
      .orWhere(phoneNumber, { phoneNumber })
      .orWhere(dateOfBirdth, { dateOfBirdth })
      .limit(20)
      .skip(skip | 0)
      .select([
        'shop.userName',
        'shop.email',
        'shop.id',
        'shop.avatar',
        'shop.background',
        'shop.phoneNumber',
      ])
      .getMany();
  }

  async updateAdmin(
    admin: AdminEcommerce,
    updateAdmin: UpdateAdminDto,
  ): Promise<AdminEcommerce> {
    return await this.adminRepo.save({ ...admin, ...updateAdmin });
  }

  async updateStatusShop(shopId: string, update: StatusShop): Promise<Shop> {
    return await this.shopRepo.save({ id: shopId, isActive: update });
  }
}
