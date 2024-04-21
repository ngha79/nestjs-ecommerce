import { DeleteResult } from 'typeorm';
import { ShopCommentImage } from 'src/entities/shop-comment-image.entity';
import { CreateShopCommentImageDTO } from '../dto/create-shop-comment-image.dto';
import { UpdateShopCommentImageDTO } from '../dto/update-shop-comment-image.dto';

export interface IShopCommentProductImage {
  createShopCommentImage(
    createShopCommentImage: CreateShopCommentImageDTO,
  ): Promise<ShopCommentImage[]>;
  updateShopCommentImage(
    updateShopCommentImage: UpdateShopCommentImageDTO,
  ): Promise<ShopCommentImage>;
  deleteShopCommentImage(ids: string[]): Promise<DeleteResult[]>;
  deleteShopCommentImageByComment(id: string): Promise<DeleteResult>;
  findShopCommentImage(id: string): Promise<ShopCommentImage>;
}
