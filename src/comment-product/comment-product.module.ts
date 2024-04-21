import { Module } from '@nestjs/common';
import { CommentProductService } from './services/comment-product.service';
import { CommentProductController } from './controllers/comment-product.controller';
import { Services } from 'src/utils/constants';
import { ShopCommentProductService } from './services/shop-comment-product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { ShopComment } from 'src/entities/shop-comment.entity';
import { CommentImage } from 'src/entities/comment-image.entity';
import { ShopCommentImage } from 'src/entities/shop-comment-image.entity';
import { ShopCommentProductController } from './controllers/shop-comment-product.controller';
import { Product } from 'src/entities/product.entity';
import { JwtModule } from '@nestjs/jwt';
import { KeyToken } from 'src/entities/keytoken.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CommentProductImageService } from './services/comment-product-image.service';
import { Shop } from 'src/entities/shop.entity';
import { ShopCommentProductImageService } from './services/shop-comment-product-image.service';
import { LikeComment } from 'src/entities/like-comment.entity';
import { Report } from 'src/entities/report.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Comment,
      ShopComment,
      CommentImage,
      ShopCommentImage,
      Product,
      KeyToken,
      Shop,
      LikeComment,
      Report,
    ]),
    JwtModule,
    CloudinaryModule,
  ],
  controllers: [CommentProductController, ShopCommentProductController],
  providers: [
    {
      provide: Services.COMMENT_PRODUCT,
      useClass: CommentProductService,
    },
    {
      provide: Services.COMMENT_PRODUCT_IMAGE,
      useClass: CommentProductImageService,
    },
    {
      provide: Services.SHOP_COMMENT_PRODUCT,
      useClass: ShopCommentProductService,
    },
    {
      provide: Services.SHOP_COMMENT_PRODUCT_IMAGE,
      useClass: ShopCommentProductImageService,
    },
  ],
  exports: [
    {
      provide: Services.COMMENT_PRODUCT,
      useClass: CommentProductService,
    },
    {
      provide: Services.COMMENT_PRODUCT_IMAGE,
      useClass: CommentProductImageService,
    },
    {
      provide: Services.SHOP_COMMENT_PRODUCT,
      useClass: ShopCommentProductService,
    },
    {
      provide: Services.SHOP_COMMENT_PRODUCT_IMAGE,
      useClass: ShopCommentProductImageService,
    },
  ],
})
export class CommentProductModule {}
