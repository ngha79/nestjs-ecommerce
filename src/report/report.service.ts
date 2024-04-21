import { Injectable } from '@nestjs/common';
import { IReportService } from './interfaces/report';
import { DeleteResult, Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report';
import { QuerySearchReport } from './dto/query-search-report';
import { Report } from 'src/entities/report.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ReportService implements IReportService {
  constructor(
    @InjectRepository(Report) private readonly reportRepo: Repository<Report>,
  ) {}
  async createReport({
    content,
    commentId,
    productId,
    shopId,
    userId,
  }: CreateReportDto): Promise<Report> {
    return await this.reportRepo.save({
      comment: { id: commentId },
      product: { id: productId },
      user: { id: userId },
      shop: { id: shopId },
      content,
    });
  }
  async deleteReport(id: string): Promise<DeleteResult> {
    return await this.reportRepo.delete({ id });
  }
  async listReport(querySearch: QuerySearchReport): Promise<any> {
    const page = parseInt(querySearch.page) - 1;
    const limit = parseInt(querySearch.limit);
    const skip = page * limit;

    const [res, total] = await this.reportRepo.findAndCount({
      where: [
        {
          shop: { id: querySearch.shopId },
        },
        {
          product: { id: querySearch.productId },
        },
        ,
        {
          comment: { id: querySearch.commentId },
        },
      ],
      relations: ['shop', 'product', 'comment', 'user'],
      select: {
        comment: {
          content: true,
          commentImage: true,
          rating: true,
          id: true,
          createdAt: true,
        },
        product: {
          name: true,
          picture: true,
          id: true,
        },
        shop: {
          email: true,
          avatar: true,
          background: true,
          userName: true,
          id: true,
        },
        user: {
          userName: true,
          avatar: true,
          background: true,
          email: true,
          id: true,
        },
        content: true,
        createdAt: true,
        id: true,
      },
      take: limit,
      skip: skip,
    });
    const lastPage = Math.floor(total / limit);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;

    return {
      data: res,
      lastPage,
      nextPage,
      prevPage,
    };
  }
}
