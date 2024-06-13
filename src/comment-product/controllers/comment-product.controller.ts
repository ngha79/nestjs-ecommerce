import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommentProductService } from '../services/comment-product.service';
import { Services } from 'src/utils/constants';
import { CreateCommentDTO } from '../dto/create-comment.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UserRequest } from 'src/user/user.decorator';
import { PayloadToken } from 'src/auth/dto/payload-token.dto';
import { CommentProductImageService } from '../services/comment-product-image.service';
import { UpdateCommentDTO } from '../dto/update-comment.dto';
import { DeleteResult } from 'typeorm';
import { QuerySearchDTO } from '../dto/query-search.dto';
import { CreateReportDto } from '../dto/create-report.dto';

@Controller('comment-product')
export class CommentProductController {
  constructor(
    @Inject(Services.COMMENT_PRODUCT)
    private readonly commentProductService: CommentProductService,
    @Inject(Services.IMAGE_UPLOAD_SERVICE)
    private readonly cloudinaryService: CloudinaryService,
    @Inject(Services.COMMENT_PRODUCT_IMAGE)
    private readonly commentProductImageService: CommentProductImageService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('file', 5))
  async createComment(
    @UserRequest() user: PayloadToken,
    @Body() createCommentDTO: CreateCommentDTO,
    @UploadedFiles()
    files: Express.Multer.File[],
  ) {
    const comment = await this.commentProductService.createComment({
      ...createCommentDTO,
      userId: user.id,
    });
    if (!comment) throw new BadRequestException('Có lỗi xảy ra.');
    const images = await this.cloudinaryService.uploadImageFromLocal(files, {
      folderName: user.id,
    });
    if (images.length) {
      await this.commentProductImageService.createCommentImage({
        commentId: comment.id,
        images,
        ...createCommentDTO,
        id: user.id,
      });
    }
    return await this.commentProductService.getCommentById(comment.id);
  }

  @UseGuards(AuthGuard)
  @Put()
  @UseInterceptors(FilesInterceptor('file', 5))
  async updateComment(
    @UserRequest() user: PayloadToken,
    @Body() updateComment: UpdateCommentDTO,
    @UploadedFiles()
    files: Express.Multer.File[],
  ) {
    const comment = await this.commentProductService.updateComment(
      updateComment,
    );
    if (!comment) throw new BadRequestException('Có lỗi xảy ra.');
    const images = await this.cloudinaryService.uploadImageFromLocal(files, {
      folderName: user.id,
    });
    if (images.length) {
      await this.commentProductImageService.createCommentImage({
        commentId: comment.id,
        images,
        ...updateComment,
        id: user.id,
      });
    }
    if (updateComment.imageDeleteIds) {
      await this.commentProductImageService.deleteCommentImage(
        updateComment.imageDeleteIds,
      );
    }
    return await this.commentProductService.getCommentById(comment.id);
  }

  @Delete(':id/:commentId')
  async deleteComment(
    @Param() id: string,
    @Param() commentId: string,
  ): Promise<DeleteResult> {
    const isDelete = await this.commentProductService.deleteComment(
      commentId,
      id,
    );
    await this.commentProductImageService.deleteCommentImageByComment(
      commentId,
    );
    return isDelete;
  }

  @Get('')
  async getListComments(@Query() querySearchDTO: QuerySearchDTO): Promise<any> {
    return await this.commentProductService.getListComments(querySearchDTO);
  }

  @Get('comment/:commentId')
  async getCommentById(@Param('commentId') commentId: string): Promise<any> {
    return await this.commentProductService.getCommentById(commentId);
  }

  @Get('/shop/:shopId')
  async getRatingShop(@Param('shopId') shopId: string): Promise<any> {
    return await this.commentProductService.getRatingShop(shopId);
  }

  @Get('product/:productId')
  async getRatingProduct(@Param('productId') productId: string): Promise<any> {
    return await this.commentProductService.getRatingProduct(productId);
  }

  @Put('like/:commentId')
  @UseGuards(AuthGuard)
  async likeComment(
    @UserRequest() user: PayloadToken,
    @Param('commentId') commentId: string,
  ): Promise<any> {
    return await this.commentProductService.likeComment(user.id, commentId);
  }

  //Report
  @Post('report')
  @UseGuards(AuthGuard)
  async userReport(
    @UserRequest() user: PayloadToken,
    @Body() createReportDto: CreateReportDto,
  ): Promise<any> {
    return await this.commentProductService.userReport(
      user.id,
      createReportDto,
    );
  }
}
