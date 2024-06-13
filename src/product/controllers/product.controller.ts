import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateProductDTO } from '../dto/product.dto';
import { UserRequest } from 'src/user/user.decorator';
import { PayloadToken } from 'src/auth/dto/payload-token.dto';
import { Product } from 'src/entities/product.entity';
import { ProductAttribute } from 'src/entities/productAttribute.entity';
import {
  IPublishOrUnPublishProduct,
  IUpdateAttributeProduct,
  IUpdateProduct,
} from '../dto/UpdateProduct.dto';
import { UpdateResult } from 'typeorm';
import { SearchProduct, SearchProductShop } from '../dto/SearchProduct.dto';
import { Services } from 'src/utils/constants';
import { ShopGuard } from 'src/guards/shop.guard';
import { ICheckOut } from '../dto/checkout-product';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ShopService } from 'src/shops/services/shop.service';
import { ProductImageService } from '../services/product-image.service';
import { AuthUser } from 'src/utils/decorators';

@Controller('product')
export class ProductController {
  constructor(
    @Inject(Services.PRODUCTS)
    private readonly productService: ProductService,
    @Inject(Services.PRODUCTS_IMAGES)
    private readonly productImageService: ProductImageService,
    @Inject(Services.IMAGE_UPLOAD_SERVICE)
    private readonly cloudinaryService: CloudinaryService,
    @Inject(Services.SHOPS)
    private readonly shopService: ShopService,
  ) {}

  @UseGuards(ShopGuard)
  @Post('')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'picture', maxCount: 8 },
      { name: 'attribute', maxCount: 12 },
    ]),
  )
  async createProduct(
    @Body() productDTO: CreateProductDTO,
    @UserRequest() user: PayloadToken,
    @UploadedFiles()
    files: {
      picture?: Express.Multer.File[];
      attribute?: Express.Multer.File[];
    },
  ) {
    const productAttribute = JSON.parse(productDTO.attributes);
    const checkShopIsActive = await this.shopService.checkShopIsActive(user.id);
    if (!checkShopIsActive) {
      throw new BadRequestException('You can not do this');
    }
    const product = await this.productService.createProduct(
      productDTO,
      checkShopIsActive,
    );
    const image = await this.cloudinaryService.uploadImageFromLocal(
      files.picture,
      {
        folderName: checkShopIsActive.id,
      },
    );
    if (image) {
      await this.productImageService.insertListImageProduct(
        checkShopIsActive,
        product,
        image,
      );
    }
    productAttribute.forEach(async (item: ProductAttribute, index: number) => {
      const thumbAttribute = await this.cloudinaryService.uploadFile(
        files.attribute[index],
        {
          folderName: checkShopIsActive.id,
        },
      );
      await this.productService.createProductAttributeAndInventory(
        item,
        product,
        checkShopIsActive,
        thumbAttribute.secure_url,
      );
    });
    return product;
  }

  @Delete(':id')
  @UseGuards(ShopGuard)
  deleteProduct(@Param('id') id: string): Promise<boolean> {
    return this.productService.deleteProductById(id);
  }

  @Get(':id')
  getProductPublish(@Param('id') id: string): Promise<Product> {
    return this.productService.getProductPublish(id);
  }

  @Get('info/:id')
  getProductManager(@Param('id') id: string): Promise<Product> {
    return this.productService.getProductById(id);
  }

  @Get('attribute/:id')
  getProductAttributeById(@Param('id') id: number): Promise<ProductAttribute> {
    return this.productService.getProductAttributeById(id);
  }

  @Put(':id')
  @UseGuards(ShopGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'pictureNew', maxCount: 8 },
      { name: 'attribute', maxCount: 12 },
    ]),
  )
  async updateProduct(
    @Param('id') id: string,
    @AuthUser() user: PayloadToken,
    @Body()
    updateProduct: IUpdateProduct,
    @UploadedFiles()
    files: {
      pictureNew?: Express.Multer.File[];
      attribute?: Express.Multer.File[];
    },
  ): Promise<UpdateResult> {
    const checkShopIsActive = await this.shopService.checkShopIsActive(user.id);
    if (!checkShopIsActive) {
      throw new BadRequestException('You can not do this');
    }
    const productAttribute = JSON.parse(
      updateProduct.attributesDelete,
    ) as number[];
    const attributesUpdate = JSON.parse(
      updateProduct.attributesUpdate,
    ) as ProductAttribute[];
    const pictureDelete = JSON.parse(updateProduct.pictureDelete) as number[];
    const product = await this.productService.getProductById(id);
    const update = await this.productService.updateProductById(
      id,
      updateProduct,
    );

    if (files.pictureNew) {
      const image = await this.cloudinaryService.uploadImageFromLocal(
        files.pictureNew,
        {
          folderName: checkShopIsActive.id,
        },
      );
      if (image) {
        await this.productImageService.insertListImageProduct(
          checkShopIsActive,
          product,
          image,
        );
      }
    }
    await this.productService.deleteProductAttributes(productAttribute);
    await this.productImageService.deleteImagesProduct(pictureDelete);
    attributesUpdate.forEach(async (item: ProductAttribute, index: number) => {
      const thumbAttribute = await this.cloudinaryService.uploadFile(
        files.attribute[index],
        {
          folderName: checkShopIsActive.id,
        },
      );
      await this.productService.updateAttributeProduct(product.id, {
        ...item,
        thumb: thumbAttribute.secure_url,
        picture: thumbAttribute.secure_url,
      });
    });
    return update;
  }

  @Patch('publish')
  @UseGuards(ShopGuard)
  publishProducts(
    @Body() productIds: IPublishOrUnPublishProduct,
  ): Promise<UpdateResult> {
    return this.productService.publishProducts(productIds);
  }

  @Patch('unpublish')
  @UseGuards(ShopGuard)
  unpublishProduct(
    @Body() productIds: IPublishOrUnPublishProduct,
  ): Promise<UpdateResult> {
    return this.productService.unpublishProduct(productIds);
  }

  @Put('attribute/:productId/:attributeId')
  @UseGuards(ShopGuard)
  updateAttributeProduct(
    @Param('productId') productId: string,
    @Param('attributeId') attributeId: number,
    @Body() updateAttributeProduct: IUpdateAttributeProduct,
  ): Promise<ProductAttribute> {
    return this.productService.updateAttributeProduct(productId, {
      ...updateAttributeProduct,
      id: attributeId,
    });
  }

  @Get('')
  allProduct(@Query() searchProduct: SearchProduct): Promise<any> {
    return this.productService.allProduct(searchProduct);
  }

  @Get('shop/list')
  allProductShop(@Query() searchProduct: SearchProductShop): Promise<any> {
    return this.productService.allProductShop(searchProduct);
  }

  @UseGuards(AuthGuard)
  @Post('checkout')
  checkoutReview(
    @UserRequest() user: PayloadToken,
    @Body() checkOutProduct: ICheckOut,
  ): Promise<any> {
    return this.productService.checkoutReview({
      ...checkOutProduct,
      id: user.id,
    });
  }

  @Get('like/:productId')
  @UseGuards(AuthGuard)
  getLikeProduct(
    @UserRequest() user: PayloadToken,
    @Param('productId') productId: string,
  ): Promise<any> {
    return this.productService.checkLikeProduct(user.id, productId);
  }

  @Put('like/:productId/:shopId')
  @UseGuards(AuthGuard)
  likeProduct(
    @UserRequest() user: PayloadToken,
    @Param('productId') productId: string,
    @Param('shopId') shopId: string,
  ): Promise<any> {
    return this.productService.likeProduct(user.id, productId, shopId);
  }

  @Put('unlike/:productId')
  @UseGuards(AuthGuard)
  unlikeProduct(
    @UserRequest() user: PayloadToken,
    @Param('productId') productId: string,
  ): Promise<any> {
    return this.productService.unlikeProduct(user.id, productId);
  }
}
