import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MessageConversation } from './message.entity';

@Entity('image-message')
export class ImageMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  url_id?: string;

  @ManyToOne(() => MessageConversation, (message) => message.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  messageConversation: MessageConversation;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
