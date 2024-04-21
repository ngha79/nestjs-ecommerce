import { DeleteResult } from 'typeorm';
import { CreateAdminDto } from '../dtos/create.dto';
import { UpdateAdminDto } from '../dtos/update.dto';
import { FindAdminDto } from '../dtos/finds.dto';
import { StatusShop } from 'src/utils/types';
import { Shop } from 'src/entities/shop.entity';
import { AdminEcommerce } from 'src/entities/admin.entity';

export interface IAdminService {
  createAdmin(createAdmin: CreateAdminDto): Promise<AdminEcommerce>;
  updateAdmin(
    admin: AdminEcommerce,
    updateAdmin: UpdateAdminDto,
  ): Promise<AdminEcommerce>;
  deleteAdmin(id: string): Promise<DeleteResult>;
  findAdmin(
    findAdminDto: FindAdminDto,
  ): Promise<AdminEcommerce[] | AdminEcommerce>;
  updateStatusShop(shopId: string, update: StatusShop): Promise<Shop>;
  deleteShop(shopId: string): Promise<DeleteResult>;
  deleteUser(userId: string): Promise<DeleteResult>;
}
