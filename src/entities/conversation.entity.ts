import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MessageConversation } from './message.entity';
import { Shop } from './shop.entity';
import { User } from './user.entity';

@Entity('conversation')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Shop, (shop) => shop)
  @JoinColumn()
  shop: Shop;

  @OneToMany(() => MessageConversation, (messages) => messages.conversation, {
    cascade: true,
  })
  messages: MessageConversation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
