import { AddressShop } from 'src/entities/address-shop.entity';
import { DeleteResult } from 'typeorm';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';

export interface IAddressShop {
  createAddressShop(createAddress: CreateAddressDto): Promise<AddressShop>;
  updateAddressShop(
    addressId: number,
    updateAddress: UpdateAddressDto,
  ): Promise<AddressShop>;
  deleteAddressShop(id: number): Promise<DeleteResult>;
}
