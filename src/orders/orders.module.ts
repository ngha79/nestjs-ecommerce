import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Services } from 'src/utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), ProductModule],
  controllers: [OrdersController],
  providers: [{ provide: Services.ORDER, useClass: OrdersService }],
  exports: [{ provide: Services.ORDER, useClass: OrdersService }],
})
export class OrdersModule {}
