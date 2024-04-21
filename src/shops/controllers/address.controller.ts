import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';

import { Services } from 'src/utils/constants';
import { AddressShopService } from '../services/address.service';
import { CreateAddressDto } from '../dto/create-address.dto';
import { AddressShop } from 'src/entities/address-shop.entity';
import { UpdateAddressDto } from '../dto/update-address.dto';

@ApiTags('Address-Shop')
@Controller('address-shop')
export class AddressController {
  constructor(
    @Inject(Services.ADDRESS_SHOP)
    private addressShopService: AddressShopService,
  ) {}

  @Post('')
  createAddressShop(
    @Body() createAddress: CreateAddressDto,
  ): Promise<AddressShop> {
    return this.addressShopService.createAddressShop(createAddress);
  }

  @Put(':id')
  updateAddressShop(
    @Param('id') addressId: number,
    @Body() updateAddress: UpdateAddressDto,
  ): Promise<AddressShop> {
    return this.addressShopService.updateAddressShop(addressId, updateAddress);
  }

  @Delete(':id')
  deleteAddressShop(@Param('id') id: number): Promise<DeleteResult> {
    return this.addressShopService.deleteAddressShop(id);
  }
}
