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
  OneToOne,
} from 'typeorm';
import { Product } from 'src/entities/product.entity';
import { StatusShop } from 'src/utils/types';
import { AddressShop } from './address-shop.entity';
import { LikeProduct } from './like-product.entity';

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

  @Column()
  phoneNumber: string;

  @Column()
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

  @OneToOne(() => AddressShop, (address) => address.shop, {
    onDelete: 'CASCADE',
  })
  address: AddressShop[];

  @OneToMany(() => Product, (product) => product.shop)
  products: Product[];

  @OneToMany(() => FollowsUser, (followers) => followers.userFollow)
  followers: FollowsUser[];

  @OneToMany(() => ProductImage, (images) => images.shop)
  images: ProductImage[];

  @OneToMany(() => LikeProduct, (likeProduct) => likeProduct.shop)
  likeProduct: LikeProduct[];
}
