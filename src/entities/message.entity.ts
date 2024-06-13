import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Shop } from './shop.entity';
import { ImageMessage } from './image-message.entity';
import { Conversation } from './conversation.entity';
import { ReplyMessage } from './reply_message.entity';

@Entity('message')
export class MessageConversation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Shop, { nullable: true })
  @JoinColumn()
  shop: Shop;

  @OneToMany(
    () => ImageMessage,
    (imageMessage) => imageMessage.messageConversation,
    {
      cascade: true,
    },
  )
  images: ImageMessage[];

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  conversation: Conversation;

  @OneToOne(() => ReplyMessage, (reply) => reply.message, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  replyMessage: ReplyMessage;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
