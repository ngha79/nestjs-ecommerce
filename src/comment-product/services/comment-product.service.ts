import { BadRequestException, Injectable } from '@nestjs/common';
import { ICommentProduct } from '../interfaces/comment-product';
import { Comment } from 'src/entities/comment.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateCommentDTO } from '../dto/create-comment.dto';
import { QuerySearchDTO } from '../dto/query-search.dto';
import { UpdateCommentDTO } from '../dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeComment } from 'src/entities/like-comment.entity';
import { Report } from 'src/entities/report.entity';
import { CreateReportDto } from '../dto/create-report.dto';

@Injectable()
export class CommentProductService implements ICommentProduct {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(LikeComment)
    private readonly likeCommentRepo: Repository<LikeComment>,
    @InjectRepository(Report)
    private readonly reportRepo: Repository<Report>,
  ) {}

  async createComment({
    productId,
    userId,
    content,
    rating,
  }: CreateCommentDTO): Promise<Comment> {
    const newComment = await this.commentRepo.save({
      content,
      user: { id: userId },
      product: { id: productId },
      rating,
    });
    return newComment;
  }

  async getCommentById(id: string): Promise<Comment> {
    const comment = await this.commentRepo.findOne({
      where: { id },
      select: {
        user: {
          id: true,
          avatar: true,
          userName: true,
        },
      },
      relations: [
        'commentImage',
        'user',
        'shopComment',
        'shopComment.shop',
        'shopComment.images',
      ],
    });
    return comment;
  }

  async updateComment({
    id,
    content,
    productId,
    rating,
  }: UpdateCommentDTO): Promise<Comment> {
    const comment = await this.commentRepo.findOneBy({
      id,
      product: { id: productId },
    });
    const update = await this.commentRepo.save({
      ...comment,
      content,
      rating,
    });
    return update;
  }

  async deleteComment(id: string, userId: string): Promise<DeleteResult> {
    const comment = await this.commentRepo.findOneBy({ id });
    if (comment.user.id !== userId)
      throw new BadRequestException(
        'Bạn không thể xóa bình luận của người khác.',
      );
    return await this.commentRepo.delete({ id });
  }

  async deleteCommentAdmin(id: string): Promise<DeleteResult> {
    return await this.commentRepo.delete({ id });
  }

  async getListComments({
    limit,
    page,
    productId,
    userId,
    rating,
    shopId,
    order,
  }: QuerySearchDTO): Promise<any> {
    // tính toán skip và take
    const pageComment = parseInt(page) - 1;
    const take = parseInt(limit);
    const skip = take * pageComment;
    // mapping thứ tự sắp xếp
    const orderMap = {
      highest: { rating: 'ASC' },
      lowest: { rating: 'DESC' },
      oldest: { createdAt: 'ASC' },
      recent: { createdAt: 'DESC' },
    };
    let orderReview = null;
    if (orderMap[order]) {
      orderReview = orderMap[order];
    }
    // Tìm các nhận xét dựa trên các tiêu chí tìm kiếm
    const [comments, total] = await this.commentRepo.findAndCount({
      where: [
        { product: { id: productId }, rating },
        { product: { shop: { id: shopId } }, rating },
        { user: { id: userId } },
      ],
      skip: skip,
      take: take,
      relations: [
        'commentImage',
        'user',
        'shopComment',
        'shopComment.shop',
        'shopComment.images',
      ],
      select: {
        commentImage: {
          id: true,
          image_id: true,
          image_url: true,
          createdAt: true,
        },
        content: true,
        id: true,
        createdAt: true,
        rating: true,
        user: { userName: true, avatar: true, email: true, id: true },
        shopComment: {
          content: true,
          createdAt: true,
          id: true,
          images: {
            id: true,
            image_id: true,
            image_url: true,
            createdAt: true,
          },
          shop: { avatar: true, userName: true, id: true },
        },
        totalLike: true,
      },
      order: order ? orderReview : { createdAt: 'ASC' },
    });
    // Tính toán các thông tin phân trang
    const lastPage = Math.floor(total / take);
    const nextPage = pageComment >= lastPage - 1 ? null : parseInt(page) + 1;
    const prevPage = pageComment < 1 ? null : parseInt(page) - 1;
    // Trả về dữ liệu phân trang
    return {
      data: comments,
      lastPage,
      nextPage,
      prevPage,
    };
  }

  async getRatingShop(shopId: string): Promise<any> {
    const specificCounts = [5, 4, 3, 2, 1];
    const countsWithSpecificCounts = await Promise.all(
      specificCounts.map(async (rating) => {
        const count = await this.commentRepo.count({
          where: {
            rating: rating,
            product: { shop: { id: shopId } },
          },
        });
        return { rating, count };
      }),
    );
    return countsWithSpecificCounts;
  }

  async getRatingProduct(productId: string): Promise<any> {
    const specificCounts = [5, 4, 3, 2, 1];
    const countsWithSpecificCounts = await Promise.all(
      specificCounts.map(async (rating) => {
        const count = await this.commentRepo.count({
          where: {
            rating: rating,
            product: { id: productId },
          },
        });
        return { rating, count };
      }),
    );
    return countsWithSpecificCounts;
  }

  async findLikeComment(id: string): Promise<LikeComment> {
    return await this.likeCommentRepo.findOne({ where: { comment: { id } } });
  }

  async createLikeComment(
    userId: string,
    commentId: string,
  ): Promise<LikeComment> {
    return await this.likeCommentRepo.save({
      comment: { id: commentId },
      user: { id: userId },
    });
  }

  async likeComment(userId: string, id: string): Promise<boolean> {
    const checkLikeComment = await this.findLikeComment(id);
    if (checkLikeComment) {
      const comment = await this.commentRepo.findOneBy({ id });

      if (comment) {
        comment.totalLike -= 1;

        await this.commentRepo.save(comment);

        await this.likeCommentRepo.delete({ comment: { id } });

        return false;
      }
    } else {
      const comment = await this.commentRepo.findOneBy({ id });

      if (comment) {
        comment.totalLike += 1;

        await this.commentRepo.save(comment);

        await this.createLikeComment(userId, id);

        return true;
      }
    }
  }

  async findReport(
    userId: string,
    { commentId, productId, shopId }: CreateReportDto,
  ): Promise<Report> {
    return await this.reportRepo.findOneBy({
      user: { id: userId },
      comment: { id: commentId },
      product: { id: productId },
      shop: { id: shopId },
    });
  }

  async userReport(
    userId: string,
    createReportDto: CreateReportDto,
  ): Promise<Report> {
    const { content, commentId, productId, shopId } = createReportDto;
    const checkReport = await this.findReport(userId, createReportDto);
    if (checkReport)
      throw new BadRequestException('Bạn đã báo cáo trước đó rồi.');
    return await this.reportRepo.save({
      user: { id: userId },
      content,
      comment: { id: commentId },
      product: { id: productId },
      shop: { id: shopId },
    });
  }
}
