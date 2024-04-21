import { Module } from '@nestjs/common';
import { ShopController } from './controllers/shop.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from 'src/entities/shop.entity';
import { Product } from 'src/entities/product.entity';
import { KeyToken } from 'src/entities/keytoken.entity';
import { JwtModule } from '@nestjs/jwt';
import { ShopService } from './services/shop.service';
import { Services } from 'src/utils/constants';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { AddressShop } from 'src/entities/address-shop.entity';
import { AddressShopService } from './services/address.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shop, Product, KeyToken, AddressShop]),
    JwtModule,
    CloudinaryModule,
  ],
  controllers: [ShopController],
  providers: [
    {
      useClass: ShopService,
      provide: Services.SHOPS,
    },
    {
      useClass: AddressShopService,
      provide: Services.ADDRESS_SHOP,
    },
  ],
  exports: [
    {
      useClass: ShopService,
      provide: Services.SHOPS,
    },
    {
      useClass: AddressShopService,
      provide: Services.ADDRESS_SHOP,
    },
  ],
})
export class ShopModule {}
