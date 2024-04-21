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

  @OneToMany(() => ListOrder, (listOrder) => listOrder.user)
  orders: ListOrder[];

  @OneToMany(() => Address, (address) => address.user)
  address: Address[];

  @OneToMany(() => FollowsUser, (following) => following.user)
  following: FollowsUser[];

  @OneToMany(() => WishtListProduct, (wishlist) => wishlist.user)
  wishlist: WishtListProduct[];

  @OneToMany(() => LikeProduct, (likeProduct) => likeProduct.user)
  likeProduct: LikeProduct[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comment: Comment[];
}
