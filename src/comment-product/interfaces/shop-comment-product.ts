import { DeleteResult } from 'typeorm';
import { CreateShopCommentDTO } from '../dto/create-shop-comment.dto';
import { ShopComment } from 'src/entities/shop-comment.entity';
import { UpdateShopCommentDTO } from '../dto/update-shop-comment.dto';

export interface IShopCommentProduct {
  createShopComment(
    createShopComment: CreateShopCommentDTO,
  ): Promise<ShopComment>;
  updateShopComment(
    updateShopComment: UpdateShopCommentDTO,
  ): Promise<ShopComment>;
  deleteShopComment(id: string, userId: string): Promise<DeleteResult>;
  deleteShopCommentAdmin(id: string): Promise<DeleteResult>;
  findShopCommentById(id: string): Promise<ShopComment>;
}
