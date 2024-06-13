import { FollowsUser } from 'src/entities/followsUser.entity';
import { ListOrder } from 'src/entities/listOrder.entity';
import { ProductImage } from 'src/entities/productImage.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Product } from 'src/entities/product.entity';
import { StatusShop } from 'src/utils/types';
import { AddressShop } from './address-shop.entity';
import { LikeProduct } from './like-product.entity';
import { Conversation } from './conversation.entity';
import { MessageConversation } from './message.entity';
import { Notification } from './notification.entity';

@Entity('shop')
export class Shop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  userName: string;

  @Column()
  password: string;

  @Column({ default: '' })
  phoneNumber: string;

  @Column({ default: '' })
  description: string;

  @Column({
    default: 0,
  })
  money: number;

  @Column({ type: 'enum', enum: StatusShop, default: StatusShop.UNACTIVE })
  isActive: StatusShop;

  @Column({ default: '' })
  avatar: string;

  @Column({ default: '' })
  background: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ListOrder, (listOrder) => listOrder.shop)
  orders: ListOrder[];

  @OneToMany(() => AddressShop, (address) => address.shop, { cascade: true })
  address: AddressShop;

  @OneToMany(() => Product, (product) => product.shop, { cascade: true })
  products: Product[];

  @OneToMany(() => FollowsUser, (followers) => followers.userFollow, {
    cascade: true,
  })
  followers: FollowsUser[];

  @OneToMany(() => ProductImage, (images) => images.shop, { cascade: true })
  images: ProductImage[];

  @OneToMany(() => LikeProduct, (likeProduct) => likeProduct.shop, {
    cascade: true,
  })
  likeProduct: LikeProduct[];

  @OneToMany(() => Conversation, (conversation) => conversation.shop, {
    cascade: true,
  })
  conversation: Conversation[];

  @OneToMany(() => MessageConversation, (message) => message.shop, {
    cascade: true,
  })
  message: MessageConversation[];

  @OneToMany(() => Notification, (notifications) => notifications.shop, {
    cascade: true,
  })
  notifications: Notification[];
}

@Entity('verify_shop')
export class VerifyShop {
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
