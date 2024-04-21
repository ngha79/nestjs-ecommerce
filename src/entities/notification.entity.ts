import { User } from 'src/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column()
  title: string;

  @Column()
  desc: string;

  @Column()
  url: string;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn()
  user: User;
}
