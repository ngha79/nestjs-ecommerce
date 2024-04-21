import { Module, forwardRef } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/entities/cart.entity';
import { CartItems } from 'src/entities/cartItem.entity';
import { CartItemModule } from 'src/cart-item/cart-item.module';
import { Services } from 'src/utils/constants';
import { User } from 'src/entities/user.entity';
import { KeyToken } from 'src/entities/keytoken.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItems, User, KeyToken]),
    forwardRef(() => CartItemModule),
  ],
  controllers: [CartController],
  providers: [{ provide: Services.CARTS, useClass: CartService }],
  exports: [{ provide: Services.CARTS, useClass: CartService }],
})
export class CartModule {}
