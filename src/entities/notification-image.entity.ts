import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Notification } from "./notification.entity";

@Entity('notification-image')
export class NotificationImage {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    url: string

    @Column()
    url_id: string

    @ManyToOne(() => Notification, noti => noti.notificationImages)
    notification: Notification

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}