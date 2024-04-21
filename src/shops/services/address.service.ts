import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { IAddressShop } from '../interfaces/address';
import { AddressShop } from 'src/entities/address-shop.entity';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';

@Injectable()
export class AddressShopService implements IAddressShop {
  constructor(
    @InjectRepository(AddressShop)
    private readonly addressShopRepository: Repository<AddressShop>,
  ) {}
  async createAddressShop(
    createAddress: CreateAddressDto,
  ): Promise<AddressShop> {
    return await this.addressShopRepository.save({
      ...createAddress,
    });
  }
  async updateAddressShop(
    addressId: number,
    updateAddress: UpdateAddressDto,
  ): Promise<AddressShop> {
    return await this.addressShopRepository.save({
      id: addressId,
      ...updateAddress,
    });
  }
  async deleteAddressShop(id: number): Promise<DeleteResult> {
    return await this.addressShopRepository.delete({ id });
  }
}
