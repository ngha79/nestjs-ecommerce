import { Shop } from 'src/entities/shop.entity';
import { CreateShopDto } from '../dto/create-shop.dto';
import { UpdateShopDto } from '../dto/update-shop.dto';
import { DeleteResult } from 'typeorm';
import { FindShopParams } from 'src/utils/types';
import {
  ChangePasswordDto,
  ChangePasswordShopDto,
} from '../dto/change-password.dto';

export interface IShopService {
  createShop(createShopDto: CreateShopDto): Promise<Shop>;
  findShopByEmail(email: string): Promise<Shop>;
  findShopById(id: string): Promise<Shop>;
  updateShop(shop: Shop, update: UpdateShopDto): Promise<Shop>;
  deleteShop(id: string): Promise<DeleteResult>;
  findShop(params: FindShopParams): Promise<any>;
  findShopByProduct(productId: string): Promise<Shop>;
  changePassword(changePasswordDto: ChangePasswordDto): Promise<Shop>;
  changePasswordShop(
    changePasswordShopDto: ChangePasswordShopDto,
  ): Promise<Shop>;
  getShopSalesInMonth(id: string): Promise<any>;
}
