import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IShopCommentProduct } from '../interfaces/shop-comment-product';
import { Comment } from 'src/entities/comment.entity';
import { DeleteResult, Repository } from 'typeorm';
import { Product } from 'src/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ShopComment } from 'src/entities/shop-comment.entity';
import { CreateShopCommentDTO } from '../dto/create-shop-comment.dto';
import { UpdateShopCommentDTO } from '../dto/update-shop-comment.dto';

@Injectable()
export class ShopCommentProductService implements IShopCommentProduct {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(ShopComment)
    private readonly shopCommentRepo: Repository<ShopComment>,
  ) {}

  async createShopComment({
    content,
    commentId,
    shopId,
  }: CreateShopCommentDTO): Promise<ShopComment> {
    const comment = await this.commentRepo.findOneBy({ id: commentId });
    if (!comment) throw new NotFoundException('Không tìm thấy sản phẩm.');
    const newComment = await this.shopCommentRepo.save({
      content,
      shop: { id: shopId },
      comment: { id: commentId },
    });
    return newComment;
  }

  async updateShopComment({
    id,
    content,
  }: UpdateShopCommentDTO): Promise<ShopComment> {
    const comment = await this.findShopCommentById(id);
    const update = await this.shopCommentRepo.save({
      ...comment,
      content,
    });
    return update;
  }

  async findShopCommentById(id: string): Promise<ShopComment> {
    return await this.shopCommentRepo.findOneBy({ id });
  }

  async deleteShopComment(id: string, shopId: string): Promise<DeleteResult> {
    const comment = await this.findShopCommentById(id);
    if (comment.shop.id !== shopId)
      throw new BadRequestException(
        'Bạn không thể xóa bình luận của người khác.',
      );
    return await this.shopCommentRepo.delete({ id });
  }

  async deleteShopCommentAdmin(id: string): Promise<DeleteResult> {
    return await this.shopCommentRepo.delete({ id });
  }
}
