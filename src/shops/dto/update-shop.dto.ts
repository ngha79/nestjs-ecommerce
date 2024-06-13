import { AddressShop } from 'src/entities/address-shop.entity';

export interface UpdateShopDto {
  userName?: string;

  phoneNumber?: string;

  description?: string;

  avatar?: string;

  background?: string;

  addressUpdate?: string;

  address?: AddressShop;
}
