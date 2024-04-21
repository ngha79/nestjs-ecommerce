import { Shop } from 'src/entities/shop.entity';

export class CreateAddressDto {
  address: string;
  userName: string;
  phoneNumber: string;
  shop: Shop;
}
