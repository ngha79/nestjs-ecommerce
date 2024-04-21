import { Reservation } from 'src/entities/reservation.entity';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { UpdateReservationDto } from '../dto/update-reservation.dto';
import { DeleteResult, UpdateResult } from 'typeorm';

export interface IReservationService {
  create(createReservationDto: CreateReservationDto): Promise<Reservation>;
  findAll(inventId: number): Promise<Reservation[]>;
  findOne(id: number): Promise<Reservation>;
  update(
    id: number,
    updateReservationDto: UpdateReservationDto,
  ): Promise<UpdateResult>;
  remove(id: number): Promise<DeleteResult>;
}
