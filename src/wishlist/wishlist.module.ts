import { Module } from '@nestjs/common';
import { WishlistController } from './wishlist.controller';
import { Services } from 'src/utils/constants';
import { WishlistService } from './wishlist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { KeyToken } from 'src/entities/keytoken.entity';
import { WishtListProduct } from 'src/entities/wishlist-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WishtListProduct, User, KeyToken])],
  controllers: [WishlistController],
  exports: [
    {
      useClass: WishlistService,
      provide: Services.WISHLIST,
    },
  ],
  providers: [
    {
      useClass: WishlistService,
      provide: Services.WISHLIST,
    },
  ],
})
export class WishlistModule {}
