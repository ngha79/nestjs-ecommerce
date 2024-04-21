import { Module, forwardRef } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { ConfigModule } from '@nestjs/config';
import { ProductAttribute } from 'src/entities/productAttribute.entity';
import { ProductController } from './controllers/product.controller';
import { JwtModule } from '@nestjs/jwt';
import { KeyToken } from 'src/entities/keytoken.entity';
import { Services } from 'src/utils/constants';
import { User } from 'src/entities/user.entity';
import { ProductImageService } from './services/product-image.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { ProductImage } from 'src/entities/productImage.entity';
import { ProductImageController } from './controllers/product-images.controller';
import { InventoriesModule } from 'src/inventories/inventories.module';
import { Shop } from 'src/entities/shop.entity';
import { ShopModule } from 'src/shops/shop.module';
import { DiscountsModule } from 'src/discounts/discounts.module';
import { CartModule } from 'src/cart/cart.module';
import { CacheModule } from '@nestjs/cache-manager';
import { LikeProduct } from 'src/entities/like-product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductAttribute,
      KeyToken,
      User,
      ProductImage,
      Shop,
      LikeProduct,
    ]),
    ConfigModule,
    ShopModule,
    JwtModule,
    CloudinaryModule,
    InventoriesModule,
    forwardRef(() => CartModule),
    DiscountsModule,
    CacheModule.register(),
  ],
  controllers: [ProductController, ProductImageController],
  providers: [
    {
      provide: Services.PRODUCTS,
      useClass: ProductService,
    },
    {
      provide: Services.PRODUCTS_IMAGES,
      useClass: ProductImageService,
    },
  ],
  exports: [
    {
      provide: Services.PRODUCTS,
      useClass: ProductService,
    },
  ],
})
export class ProductModule {}
