import { Address } from 'src/entities/address.entity';
import { FollowsUser } from 'src/entities/followsUser.entity';
import { ListOrder } from 'src/entities/listOrder.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { WishtListProduct } from './wishlist-user.entity';
import { LikeProduct } from './like-product.entity';
import { Comment } from './comment.entity';
import { Conversation } from './conversation.entity';
import { MessageConversation } from './message.entity';
import { Notification } from './notification.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  userName: string;

  @Column()
  password: string;

  @Column()
  phoneNumber: string;

  @Column({ default: 0 })
  payment: number;

  @Column({ default: 0 })
  money: number;

  @Column({ default: '' })
  avatar: string;

  @Column({ default: '' })
  background: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ListOrder, (listOrder) => listOrder.user, { cascade: true })
  orders: ListOrder[];

  @OneToMany(() => Address, (address) => address.user, { cascade: true })
  address: Address[];

  @OneToMany(() => FollowsUser, (following) => following.user, {
    cascade: true,
  })
  following: FollowsUser[];

  @OneToMany(() => WishtListProduct, (wishlist) => wishlist.user, {
    cascade: true,
  })
  wishlist: WishtListProduct[];

  @OneToMany(() => LikeProduct, (likeProduct) => likeProduct.user)
  likeProduct: LikeProduct[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comment: Comment[];

  @OneToMany(() => Conversation, (conversation) => conversation.user, {
    cascade: true,
  })
  conversation: Conversation[];

  @OneToMany(() => MessageConversation, (message) => message.user, {
    cascade: true,
  })
  message: MessageConversation[];

  @OneToMany(() => Notification, (notifications) => notifications.user, {
    cascade: true,
  })
  notifications: Notification[];
}

@Entity('verify_user')
export class VerifyUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  userName: string;

  @Column()
  password: string;

  @Column()
  phoneNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
