import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/entities/notification.entity';
import { Repository } from 'typeorm';
import { FindAllNotificationsDto } from './dto/find-notification.dto';

export interface PaginationNotificationData {
  data: Notification[];
  lastPage: number;
  prevPage: number | null;
  nextPage: number | null;
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notiRepo: Repository<Notification>,
  ) {}

  async create({
    noti_desc,
    noti_title,
    noti_url,
    shopReceiverId,
    userReceiverId,
  }: CreateNotificationDto) {
    return await this.notiRepo.save({
      noti_desc,
      noti_title,
      noti_url,
      shop: { id: shopReceiverId },
      user: { id: userReceiverId },
    });
  }

  async findAll(
    findAllNotifications: FindAllNotificationsDto,
  ): Promise<PaginationNotificationData> {
    const page = +findAllNotifications.page;
    const limit = +findAllNotifications.limit;
    const skip = limit * (page - 1);
    const [res, total] = await this.notiRepo.findAndCount({
      where: {
        user: { id: findAllNotifications.userReceiverId },
        shop: { id: findAllNotifications.shopReceiverId },
      },
      relations: ['notificationImages'],
      skip,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    const lastPage = Math.ceil(total / limit);

    let prevPage: number | null = null;
    if (page > 1) {
      prevPage = page - 1;
    }

    let nextPage: number | null = null;
    if (page < lastPage) {
      nextPage = page + 1;
    }

    const paginationData = {
      data: res,
      lastPage,
      prevPage,
      nextPage,
    };
    return paginationData;
  }

  async findOne(id: string) {
    return await this.notiRepo.findOne({
      where: { id },
      relations: ['notificationImages'],
    });
  }

  async update(id: string) {
    return await this.notiRepo.update({ id }, { noti_is_read: false });
  }

  async updateAll(userId: string) {
    return await this.notiRepo.update(
      { user: { id: userId }, noti_is_read: false },
      { noti_is_read: true },
    );
  }

  async getTotalNotiIsNotRead(userId: string) {
    return await this.notiRepo.count({
      where: { user: { id: userId }, noti_is_read: false },
    });
  }

  async remove(id: string) {
    return await this.notiRepo.delete({ id });
  }
}
