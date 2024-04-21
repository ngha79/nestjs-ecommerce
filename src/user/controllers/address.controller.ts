import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { DeleteResult } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';
import {
  IUpdateAddressUser,
  InfoAddressUser,
} from '../dto/InfoAddressUser.dto';
import { Address } from 'src/entities/address.entity';
import { UserRequest } from '../user.decorator';
import { PayloadToken } from 'src/auth/dto/payload-token.dto';
import { Services } from 'src/utils/constants';
import { AddressService } from '../services/address.service';

@ApiTags('Address')
@Controller('address')
export class AddressController {
  constructor(
    @Inject(Services.ADDRESS)
    private addressService: AddressService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('')
  insertAddressForAccount(
    @UserRequest() user: PayloadToken,
    @Body() infoAddressUser: InfoAddressUser,
  ): Promise<Address> {
    return this.addressService.insertAddressForAccount(
      user.userId,
      infoAddressUser,
    );
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  updateAddressForAccount(
    @Param('id') addressId: number,
    @UserRequest() user: PayloadToken,
    @Body() updateAddress: IUpdateAddressUser,
  ): Promise<Address> {
    return this.addressService.updateAddressForAccount(
      user.userId,
      addressId,
      updateAddress,
    );
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteAddressForAccount(@Param('id') id: number): Promise<DeleteResult> {
    return this.addressService.deleteAddressForAccount(id);
  }

  @Get(':id')
  address(@Param('id') addressId: number): Promise<Address> {
    return this.addressService.address(addressId);
  }

  @UseGuards(AuthGuard)
  @Get('')
  allAddress(@UserRequest() user: PayloadToken): Promise<Address[]> {
    return this.addressService.allAddress(user.userId);
  }
}
