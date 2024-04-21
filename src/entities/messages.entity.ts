import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ImageConversation } from './imagesConversation.entity';
import { Discount } from './discount.entity';
import { User } from 'src/entities/user.entity';
import { Conversation } from './converstion.entity';
import { Shop } from './shop.entity';

@Entity('messages')
export class Messages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column()
  slug: string;

  @OneToMany(() => ImageConversation, (image) => image.messages)
  @JoinColumn()
  images: ImageConversation[];

  @OneToOne(() => Discount, (discount) => discount, {
    createForeignKeyConstraints: false,
  })
  discount: Discount;

  @OneToOne(() => User, (user) => user, { createForeignKeyConstraints: false })
  @JoinColumn()
  user: User;

  @OneToOne(() => Shop, (shop) => shop, { createForeignKeyConstraints: false })
  @JoinColumn()
  shop: Shop;

  @OneToOne(() => Conversation, (conversation) => conversation, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  conversation: Conversation;
}
