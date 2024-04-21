import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { Services } from 'src/utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from 'src/entities/reservation.entity';
import { Order } from 'src/entities/order.entity';
import { ListOrder } from 'src/entities/listOrder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Order, ListOrder])],
  controllers: [ReservationController],
  providers: [
    { provide: Services.RESERVATION_SERVICE, useClass: ReservationService },
  ],
  exports: [
    { provide: Services.RESERVATION_SERVICE, useClass: ReservationService },
  ],
})
export class ReservationModule {}
