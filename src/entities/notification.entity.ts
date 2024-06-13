import { User } from 'src/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NotificationImage } from './notification-image.entity';
import { Shop } from './shop.entity';

@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', default: false })
  noti_is_read: boolean;

  @Column()
  noti_title: string;

  @Column()
  noti_desc: string;

  @Column()
  noti_url: string;

  @ManyToOne(() => User, (user) => user.notifications, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Shop, (shop) => shop.notifications, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  shop: Shop;

  @ManyToOne(() => NotificationImage, (noti) => noti.notification)
  @JoinColumn()
  notificationImages: NotificationImage;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
