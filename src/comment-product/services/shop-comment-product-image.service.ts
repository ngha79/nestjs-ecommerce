import { BadRequestException, Injectable } from '@nestjs/common';
import { IShopCommentProductImage } from '../interfaces/shop-comment-product-image';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { CreateShopCommentImageDTO } from '../dto/create-shop-comment-image.dto';
import { ShopCommentImage } from 'src/entities/shop-comment-image.entity';
import { UpdateShopCommentImageDTO } from '../dto/update-shop-comment-image.dto';

@Injectable()
export class ShopCommentProductImageService
  implements IShopCommentProductImage
{
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(ShopCommentImage)
    private readonly shopCommentImageRepo: Repository<ShopCommentImage>,
  ) {}

  async createShopCommentImage({
    commentId,
    images,
    shopId,
  }: CreateShopCommentImageDTO): Promise<ShopCommentImage[]> {
    const commentImages = await Promise.all(
      images.map(async (image): Promise<ShopCommentImage> => {
        return await this.shopCommentImageRepo.save({
          comment: { id: commentId },
          image_id: image.public_id,
          image_url: image.secure_url,
          shop: { id: shopId },
        });
      }),
    );
    return commentImages;
  }

  async updateShopCommentImage({
    id,
    image,
    image_id,
  }: UpdateShopCommentImageDTO): Promise<ShopCommentImage> {
    const commentImage = await this.findShopCommentImage(id);
    if (!commentImage) throw new BadRequestException('Có lỗi xảy ra.');
    return await this.shopCommentImageRepo.save({
      ...commentImage,
      image_url: image,
      image_id: image_id,
    });
  }

  async findShopCommentImage(id: string): Promise<ShopCommentImage> {
    return await this.shopCommentImageRepo.findOneBy({ id });
  }

  async deleteShopCommentImage(ids: string[]): Promise<DeleteResult[]> {
    const commentImages = await Promise.all(
      ids.map(async (id): Promise<DeleteResult> => {
        return await this.shopCommentImageRepo.delete({ id });
      }),
    );
    return commentImages;
  }

  async deleteShopCommentImageByComment(id: string): Promise<DeleteResult> {
    return await this.shopCommentImageRepo.delete({
      comment: { id },
    });
  }
}
