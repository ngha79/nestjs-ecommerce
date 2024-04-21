import { Module, forwardRef } from '@nestjs/common';
import { ListOrdersService } from './list-orders.service';
import { ListOrdersController } from './list-orders.controller';
import { Services } from 'src/utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListOrder } from 'src/entities/listOrder.entity';
import { Order } from 'src/entities/order.entity';
import { OrdersModule } from 'src/orders/orders.module';
import { CacheModule } from '@nestjs/cache-manager';
import { User } from 'src/entities/user.entity';
import { InventoriesModule } from 'src/inventories/inventories.module';
import { DiscountsModule } from 'src/discounts/discounts.module';
import { ProductModule } from 'src/product/product.module';
import { KeyToken } from 'src/entities/keytoken.entity';
import { ShopModule } from 'src/shops/shop.module';
import { Shop } from 'src/entities/shop.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ListOrder, Order, User, KeyToken, Shop]),
    forwardRef(() => OrdersModule),
    CacheModule.register(),
    InventoriesModule,
    DiscountsModule,
    ProductModule,
    ShopModule,
  ],
  controllers: [ListOrdersController],
  providers: [{ provide: Services.LIST_ORDER, useClass: ListOrdersService }],
  exports: [{ provide: Services.LIST_ORDER, useClass: ListOrdersService }],
})
export class ListOrdersModule {}
