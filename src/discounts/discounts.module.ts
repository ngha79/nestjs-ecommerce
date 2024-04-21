import { Module } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { DiscountsController } from './discounts.controller';
import { Services } from 'src/utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discount } from 'src/entities/discount.entity';
import { UserModule } from 'src/user/user.module';
import { ProductAttribute } from 'src/entities/productAttribute.entity';
import { Product } from 'src/entities/product.entity';
import { DiscountUserUsed } from 'src/entities/discountUserUsed.entity';
import { KeyToken } from 'src/entities/keytoken.entity';
import { Shop } from 'src/entities/shop.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Discount,
      ProductAttribute,
      Product,
      DiscountUserUsed,
      KeyToken,
      Shop,
    ]),
    UserModule,
  ],
  controllers: [DiscountsController],
  providers: [{ provide: Services.DISCOUNT, useClass: DiscountsService }],
  exports: [{ provide: Services.DISCOUNT, useClass: DiscountsService }],
})
export class DiscountsModule {}
