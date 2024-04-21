import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from 'src/entities/reservation.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Order } from 'src/entities/order.entity';
import { IReservationService } from './interfaces/reservations';

@Injectable()
export class ReservationService implements IReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    return await this.reservationRepository.save({
      ...createReservationDto,
    });
  }

  async findAll(inventId: number): Promise<Reservation[]> {
    return await this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.inventory.id = :id', { id: inventId })
      .getMany();
  }

  async findOne(id: number): Promise<Reservation> {
    return await this.reservationRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updateReservationDto: UpdateReservationDto,
  ): Promise<UpdateResult> {
    // const order = await this.orderRepository.findOneBy({
    //   id: updateReservationDto.orderId,
    // });
    // if (!order || order.status === StatusOrder.CANCELLED)
    //   throw new NotFoundException('Order does not existed!');
    return await this.reservationRepository.update(
      { id },
      { quantity: updateReservationDto.quantity },
    );
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.reservationRepository.delete({ id });
  }
}
