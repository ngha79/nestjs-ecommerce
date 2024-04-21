import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Services } from 'src/utils/constants';
import { Reservation } from 'src/entities/reservation.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('reservation')
export class ReservationController {
  constructor(
    @Inject(Services.RESERVATION_SERVICE)
    private readonly reservationService: ReservationService,
  ) {}

  @Post()
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(createReservationDto);
  }

  @Get('invent:id')
  findAll(@Param('id') id: number): Promise<Reservation[]> {
    return this.reservationService.findAll(id);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Reservation> {
    return this.reservationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateReservationDto: UpdateReservationDto,
  ): Promise<UpdateResult> {
    return this.reservationService.update(id, updateReservationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<DeleteResult> {
    return this.reservationService.remove(id);
  }
}
