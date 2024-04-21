import { DeleteResult } from 'typeorm';
import { CommentImage } from 'src/entities/comment-image.entity';
import { CreateCommentImageDTO } from '../dto/create-comment-image.dto';
import { UpdateCommentImageDTO } from '../dto/update-comment-image.dto';

export interface ICommentProductImage {
  createCommentImage(
    createCommentImage: CreateCommentImageDTO,
  ): Promise<CommentImage[]>;
  updateCommentImage(
    updateCommentImage: UpdateCommentImageDTO,
  ): Promise<CommentImage>;
  deleteCommentImage(ids: string[]): Promise<DeleteResult[]>;
  deleteCommentImageByComment(id: string): Promise<DeleteResult>;
  findCommentImage(id: string): Promise<CommentImage>;
}
