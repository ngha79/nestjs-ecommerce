import { Comment } from 'src/entities/comment.entity';
import { CreateCommentDTO } from '../dto/create-comment.dto';
import { DeleteResult } from 'typeorm';
import { UpdateCommentDTO } from '../dto/update-comment.dto';
import { QuerySearchDTO } from '../dto/query-search.dto';
import { LikeComment } from 'src/entities/like-comment.entity';
import { CreateReportDto } from '../dto/create-report.dto';
import { Report } from 'src/entities/report.entity';

export interface ICommentProduct {
  createComment(createComment: CreateCommentDTO): Promise<Comment>;
  updateComment(updateComment: UpdateCommentDTO): Promise<Comment>;
  deleteComment(id: string, userId: string): Promise<DeleteResult>;
  deleteCommentAdmin(id: string): Promise<DeleteResult>;
  getListComments(querySearch: QuerySearchDTO): Promise<any>;
  getRatingShop(shopId: string): Promise<any>;
  getCommentById(id: string): Promise<Comment>;
  likeComment(userId: string, commentId: string): Promise<boolean>;
  findLikeComment(id: string): Promise<LikeComment>;
  createLikeComment(userId: string, commentId: string): Promise<LikeComment>;
  userReport(userId: string, createReportDto: CreateReportDto): Promise<Report>;
  findReport(userId: string, createReportDto: CreateReportDto): Promise<Report>;
}
