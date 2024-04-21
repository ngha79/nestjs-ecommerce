import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';
import { Shop } from './shop.entity';

@Entity('like_product')
export class LikeProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.wishlist)
  user: User;

  @ManyToOne(() => Product, (product) => product.likeProduct)
  product: Product;

  @ManyToOne(() => Shop, (shop) => shop.likeProduct)
  shop: Shop;
}
