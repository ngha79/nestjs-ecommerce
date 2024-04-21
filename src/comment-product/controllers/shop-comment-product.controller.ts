import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Services } from 'src/utils/constants';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UserRequest } from 'src/user/user.decorator';
import { PayloadToken } from 'src/auth/dto/payload-token.dto';
import { DeleteResult } from 'typeorm';
import { ShopCommentProductService } from '../services/shop-comment-product.service';
import { ShopCommentProductImageService } from '../services/shop-comment-product-image.service';
import { CreateShopCommentDTO } from '../dto/create-shop-comment.dto';
import { ShopGuard } from 'src/guards/shop.guard';
import { UpdateShopCommentDTO } from '../dto/update-shop-comment.dto';

@Controller('shop-comment-product')
export class ShopCommentProductController {
  constructor(
    @Inject(Services.SHOP_COMMENT_PRODUCT)
    private readonly shopCommentProductService: ShopCommentProductService,
    @Inject(Services.IMAGE_UPLOAD_SERVICE)
    private readonly cloudinaryService: CloudinaryService,
    @Inject(Services.SHOP_COMMENT_PRODUCT_IMAGE)
    private readonly shopCommentProductImageService: ShopCommentProductImageService,
  ) {}

  @UseGuards(ShopGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('file', 5))
  async createShopComment(
    @UserRequest() user: PayloadToken,
    @Body() createShopCommentDTO: CreateShopCommentDTO,
    @UploadedFiles()
    files: Express.Multer.File[],
  ) {
    const comment = await this.shopCommentProductService.createShopComment({
      ...createShopCommentDTO,
      shopId: user.userId,
    });
    if (!comment) throw new BadRequestException('Có lỗi xảy ra.');
    const images = await this.cloudinaryService.uploadImageFromLocal(files, {
      folderName: user.userId,
    });
    if (images?.length) {
      await this.shopCommentProductImageService.createShopCommentImage({
        commentId: comment.id,
        images,
        shopId: user.userId,
      });
    }
    return comment;
  }

  @UseGuards(ShopGuard)
  @Put()
  @UseInterceptors(FilesInterceptor('file', 5))
  async updateShopComment(
    @UserRequest() user: PayloadToken,
    @Body() updateShopComment: UpdateShopCommentDTO,
    @UploadedFiles()
    files: Express.Multer.File[],
  ) {
    const comment = await this.shopCommentProductService.updateShopComment(
      updateShopComment,
    );
    if (!comment) throw new BadRequestException('Có lỗi xảy ra.');
    const images = await this.cloudinaryService.uploadImageFromLocal(files, {
      folderName: user.userId,
    });
    if (images.length) {
      await this.shopCommentProductImageService.createShopCommentImage({
        commentId: comment.id,
        images,
        shopId: user.userId,
      });
    }
    if (updateShopComment.imageDeleteIds) {
      await this.shopCommentProductImageService.deleteShopCommentImage(
        updateShopComment.imageDeleteIds,
      );
    }
    return comment;
  }

  @Delete(':shopId/:commentId')
  async deleteShopComment(
    @Param() shopId: string,
    @Param() commentId: string,
  ): Promise<DeleteResult> {
    const isDelete = await this.shopCommentProductService.deleteShopComment(
      commentId,
      shopId,
    );
    await this.shopCommentProductImageService.deleteShopCommentImageByComment(
      commentId,
    );
    return isDelete;
  }
}
