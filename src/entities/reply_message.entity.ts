import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MessageConversation } from './message.entity';

@Entity('reply_message')
export class ReplyMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => MessageConversation, (message) => message, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  message: MessageConversation;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
