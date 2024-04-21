import { StatusShop } from 'src/utils/types';

export class CreateShopAdminDto {
  email: string;

  userName: string;

  password: string;

  phoneNumber: string;

  address: string;

  avatar: string;

  background: string;

  description: string;

  isActive: StatusShop;
}
