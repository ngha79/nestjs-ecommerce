import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductAttribute } from './productAttribute.entity';
import { Shop } from './shop.entity';
import { BrandProduct } from 'src/utils/types';
import { ProductImage } from './productImage.entity';
import { Comment } from './comment.entity';
import { LikeProduct } from './like-product.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    default: 0,
  })
  sold: number;

  @Column()
  slug: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isPublish: boolean;

  @Column({
    type: 'enum',
    enum: BrandProduct,
  })
  brand: BrandProduct;

  @Column()
  price: number;

  @Column()
  detail: string;

  @OneToMany(() => ProductAttribute, (attribute) => attribute.product, {
    cascade: true,
  })
  @JoinColumn()
  attributes: ProductAttribute[];

  @OneToMany(() => ProductImage, (pricture) => pricture.product, {
    cascade: true,
  })
  @JoinColumn()
  picture: ProductImage[];

  @OneToMany(() => Comment, (comment) => comment.product, { cascade: true })
  @JoinColumn()
  comment: Comment[];

  @ManyToOne(() => Shop, { onDelete: 'CASCADE' })
  @JoinColumn()
  shop: Shop;

  @OneToMany(() => LikeProduct, (likeProduct) => likeProduct.product, {
    cascade: true,
  })
  likeProduct: LikeProduct;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
