import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Comment } from 'src/entities/comment.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { ICommentProductImage } from '../interfaces/comment-product-image';
import { CommentImage } from 'src/entities/comment-image.entity';
import { CreateCommentImageDTO } from '../dto/create-comment-image.dto';
import { UpdateCommentImageDTO } from '../dto/update-comment-image.dto';

@Injectable()
export class CommentProductImageService implements ICommentProductImage {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(CommentImage)
    private readonly commentImageRepo: Repository<CommentImage>,
  ) {}
  async createCommentImage({
    commentId,
    images,
    userId,
    productId,
  }: CreateCommentImageDTO): Promise<CommentImage[]> {
    const comment = await this.commentRepo.findOneBy({ id: commentId });
    if (!comment) throw new NotFoundException('Bình luận không tồn tại.');
    const commentImages = await Promise.all(
      images.map(async (image): Promise<CommentImage> => {
        return await this.commentImageRepo.save({
          comment,
          image_id: image.public_id,
          image_url: image.secure_url,
          user: { id: userId },
          product: { id: productId },
        });
      }),
    );
    return commentImages;
  }

  async updateCommentImage({
    id,
    image,
    image_id,
  }: UpdateCommentImageDTO): Promise<CommentImage> {
    const commentImage = await this.findCommentImage(id);
    if (!commentImage) throw new BadRequestException('Có lỗi xảy ra.');
    return await this.commentImageRepo.save({
      ...commentImage,
      image_url: image,
      image_id: image_id,
    });
  }

  async findCommentImage(id: string): Promise<CommentImage> {
    return await this.commentImageRepo.findOneBy({ id });
  }

  async deleteCommentImage(ids: string[]): Promise<DeleteResult[]> {
    const commentImages = await Promise.all(
      ids.map(async (id): Promise<DeleteResult> => {
        return await this.commentImageRepo.delete({ id });
      }),
    );
    return commentImages;
  }

  async deleteCommentImageByComment(id: string): Promise<DeleteResult> {
    return await this.commentImageRepo.delete({ comment: { id } });
  }
}
