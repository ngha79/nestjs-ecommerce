import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import {
  IUpdateAddressUser,
  InfoAddressUser,
} from '../dto/InfoAddressUser.dto';
import { Address } from 'src/entities/address.entity';
import { Services } from 'src/utils/constants';
import { FollowUsersService } from 'src/follow-users/follow-users.service';
import { ProfileUser } from 'src/utils/types';
import { UserService } from './user.service';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @Inject(forwardRef(() => Services.FOLLOW_USERS))
    private readonly followsService: FollowUsersService,
    @Inject(forwardRef(() => Services.USERS))
    private readonly userService: UserService,
  ) {}

  async insertAddressForAccount(
    id: string,
    infoAddress: InfoAddressUser,
  ): Promise<Address> {
    if (infoAddress.isAddressDefault) {
      await this.addressRepository.update(
        { user: { id: id }, isAddressDefault: true },
        { isAddressDefault: false },
      );
    }
    return await this.addressRepository.save({
      ...infoAddress,
      user: { id: id },
    });
  }

  async updateAddressForAccount(
    id: string,
    addressId: number,
    updateAddress: IUpdateAddressUser,
  ): Promise<Address> {
    if (updateAddress.isAddressDefault) {
      await this.addressRepository.update(
        { user: { id: id }, isAddressDefault: true },
        { isAddressDefault: false },
      );
    }
    return await this.addressRepository.save({
      id: addressId,
      ...updateAddress,
    });
  }

  async deleteAddressForAccount(id: number): Promise<DeleteResult> {
    return await this.addressRepository.delete({
      id,
      isAddressDefault: false,
    });
  }

  async allAddress(id: string): Promise<Address[]> {
    return await this.addressRepository.find({
      where: { user: { id: id } },
      order: { isAddressDefault: 'DESC' },
    });
  }

  async address(addressId: number): Promise<Address> {
    return await this.addressRepository.findOne({ where: { id: addressId } });
  }

  async getShop(shopId: string): Promise<ProfileUser> {
    const follow = await this.followsService.getTotalFollowerAndFollowingUser(
      shopId,
    );
    return {
      user: await this.userRepository.findOne({
        where: { id: shopId },
      }),
      ...follow,
    };
  }
}
