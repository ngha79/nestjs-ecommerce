import { Module, forwardRef } from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import { InventoriesController } from './inventories.controller';
import { Services } from 'src/utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from 'src/entities/inventories.entity';
import { ProductModule } from 'src/product/product.module';
import { UserModule } from 'src/user/user.module';
import { ReservationModule } from 'src/reservation/reservation.module';
import { User } from 'src/entities/user.entity';
import { KeyToken } from 'src/entities/keytoken.entity';
import { Shop } from 'src/entities/shop.entity';
import { Order } from 'src/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventory, User, KeyToken, Shop, Order]),
    forwardRef(() => ProductModule),
    ReservationModule,
    UserModule,
  ],
  controllers: [InventoriesController],
  providers: [{ provide: Services.INVENTORIES, useClass: InventoriesService }],
  exports: [{ provide: Services.INVENTORIES, useClass: InventoriesService }],
})
export class InventoriesModule {}
