import { PayloadToken } from 'src/auth/dto/payload-token.dto';
import { User } from '../../entities/user.entity';
import { UpdateUser } from '../dto/update-user.dto';
import { DeleteResult } from 'typeorm';
import { SearchUsers } from '../dto/search-users.dto';
import { ProfileUser } from 'src/utils/types';
import { IChangePassword } from '../dto/change-password';

export interface IUserService {
  getProfileUser(user: PayloadToken): Promise<User>;
  updateProfileUser(id: string, update: UpdateUser): Promise<User>;
  updateAvatarUser(id: string, update: object): Promise<User>;
  findUserById(id: string): Promise<User>;
  findUser(id: string): Promise<User>;
  deleteUserById(id: string): Promise<DeleteResult>;
  findAllUser(querySearch: SearchUsers): Promise<any>;
  checkShopIsActive(shopId: string): Promise<User>;
  getShop(shopId: string): Promise<ProfileUser>;
  findShopByProduct(productId: string): Promise<User>;
  changePassword(id: string, changePassword: IChangePassword): Promise<any>;
}
