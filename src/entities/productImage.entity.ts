import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Shop } from './shop.entity';
import { Product } from './product.entity';

@Entity('product_image')
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_thumb: string;

  @Column()
  product_image_url: string;

  @Column()
  image_id: string;

  @ManyToOne(() => Shop, (shop) => shop.images, {
    onDelete: 'CASCADE',
  })
  shop: Shop;

  @ManyToOne(() => Product, (product) => product.picture, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
