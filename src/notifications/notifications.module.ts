import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Notification } from 'src/entities/notification.entity';
import { NotificationImage } from 'src/entities/notification-image.entity';
import { User } from 'src/entities/user.entity';
import { KeyToken } from 'src/entities/keytoken.entity';
import { Shop } from 'src/entities/shop.entity';
import { Services } from 'src/utils/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Notification,
      NotificationImage,
      User,
      KeyToken,
      Shop,
    ]),
    JwtModule,
  ],
  controllers: [NotificationsController],
  providers: [
    { provide: Services.NOTIFICATION, useClass: NotificationsService },
  ],
  exports: [{ provide: Services.NOTIFICATION, useClass: NotificationsService }],
})
export class NotificationsModule {}
