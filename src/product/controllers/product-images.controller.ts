import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Services } from 'src/utils/constants';
import { ProductImageService } from '../services/product-image.service';
import { ProductImage } from 'src/entities/productImage.entity';
import {
  CreateProductImage,
  QuerySearchImageProduct,
  UpdateProductImage,
} from '../dto/productImage.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UserRequest } from 'src/user/user.decorator';
import { PayloadToken } from 'src/auth/dto/payload-token.dto';

@Controller('product-image')
export class ProductImageController {
  constructor(
    @Inject(Services.PRODUCTS_IMAGES)
    private readonly productImageService: ProductImageService,
  ) {}

  @Post()
  create(
    @Body() createProductImage: CreateProductImage,
  ): Promise<ProductImage> {
    return this.productImageService.createImageProduct(createProductImage);
  }

  @Delete(':imageId')
  delete(@Param('imageId') imageId: string): Promise<DeleteResult> {
    return this.productImageService.deleteImageProduct(imageId);
  }

  @Delete('')
  deleteList(@Body() data: { imageIds: number[] }): Promise<DeleteResult> {
    return this.productImageService.deleteImagesProduct(data.imageIds);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateProductImage: UpdateProductImage,
  ): Promise<UpdateResult> {
    return this.productImageService.updateImageProduct(id, updateProductImage);
  }

  @Get(':id')
  get(@Param('id') id: number): Promise<ProductImage> {
    return this.productImageService.getImage(id);
  }
  @Get(':id')
  getList(
    @UserRequest() user: PayloadToken,
    @Query() querySearchImageProduct: QuerySearchImageProduct,
  ): Promise<any> {
    return this.productImageService.getAllImageByShop(
      user.userId,
      querySearchImageProduct,
    );
  }
}
