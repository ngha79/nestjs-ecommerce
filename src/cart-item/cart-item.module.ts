import { Module, forwardRef } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CartItemController } from './cart-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItems } from 'src/entities/cartItem.entity';
import { CartModule } from 'src/cart/cart.module';
import { ProductModule } from 'src/product/product.module';
import { Services } from 'src/utils/constants';
import { InventoriesModule } from 'src/inventories/inventories.module';
import { User } from 'src/entities/user.entity';
import { KeyToken } from 'src/entities/keytoken.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartItems, User, KeyToken]),
    ProductModule,
    forwardRef(() => CartModule),
    InventoriesModule,
  ],
  controllers: [CartItemController],
  providers: [{ provide: Services.CART_ITEMS, useClass: CartItemService }],
  exports: [{ provide: Services.CART_ITEMS, useClass: CartItemService }],
})
export class CartItemModule {}
