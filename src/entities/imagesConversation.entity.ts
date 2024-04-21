import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Messages } from './messages.entity';
import { Conversation } from './converstion.entity';

@Entity('images_conversation')
export class ImageConversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image: string;

  @ManyToOne(() => Messages, (messages) => messages.images)
  messages?: Messages;

  @ManyToOne(() => Conversation, (conversation) => conversation)
  conversation: Conversation;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
