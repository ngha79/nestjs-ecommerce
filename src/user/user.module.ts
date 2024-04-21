import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { KeyToken } from '../entities/keytoken.entity';
import { Address } from 'src/entities/address.entity';
import { Services } from 'src/utils/constants';
import { FollowsUser } from 'src/entities/followsUser.entity';
import { FollowUsersModule } from 'src/follow-users/follow-users.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { AddressService } from './services/address.service';
import { AddressController } from './controllers/address.controller';
import { Product } from 'src/entities/product.entity';
import { Shop } from 'src/entities/shop.entity';
import { AdminEcommerce } from 'src/entities/admin.entity';
import { Cart } from 'src/entities/cart.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      KeyToken,
      Address,
      FollowsUser,
      Product,
      Shop,
      AdminEcommerce,
      Cart,
    ]),
    ConfigModule,
    JwtModule.register({
      global: true,
    }),
    forwardRef(() => FollowUsersModule),
    CloudinaryModule,
  ],
  controllers: [UserController, AddressController],
  providers: [
    {
      provide: Services.USERS,
      useClass: UserService,
    },
    {
      provide: Services.ADDRESS,
      useClass: AddressService,
    },
  ],
  exports: [
    {
      provide: Services.USERS,
      useClass: UserService,
    },
    {
      provide: Services.ADDRESS,
      useClass: AddressService,
    },
  ],
})
export class UserModule {}
