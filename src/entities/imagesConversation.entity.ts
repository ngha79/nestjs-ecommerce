import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Conversation } from './conversation.entity';
import { MessageConversation } from './message.entity';

@Entity('images_conversation')
export class ImageConversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image: string;

  @ManyToOne(() => MessageConversation, (message) => message.images)
  message?: MessageConversation;

  @ManyToOne(() => Conversation, (conversation) => conversation)
  conversation: Conversation;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
