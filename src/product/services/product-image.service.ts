import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  CreateProductImage,
  QuerySearchImageProduct,
  UpdateProductImage,
} from '../dto/productImage.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImage } from 'src/entities/productImage.entity';
import { DeleteResult, In, Repository, UpdateResult } from 'typeorm';
import { Services } from 'src/utils/constants';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ShopService } from 'src/shops/services/shop.service';
import { Shop } from 'src/entities/shop.entity';
import { Product } from 'src/entities/product.entity';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    @Inject(Services.SHOPS)
    private readonly shopService: ShopService,
    @Inject(Services.IMAGE_UPLOAD_SERVICE)
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createImageProduct(
    createProductImage: CreateProductImage,
  ): Promise<ProductImage> {
    return await this.productImageRepository.save(createProductImage);
  }

  async insertListImageProduct(
    shop: Shop,
    product: Product,
    listImage: any[],
  ): Promise<ProductImage[]> {
    return await Promise.all(
      listImage.map(async (image) => {
        const newImageProduct = await this.createImageProduct({
          image_id: image.public_id,
          product: product,
          shop,
          product_image_url: image.secure_url,
          product_thumb: image.secure_url,
        });
        if (newImageProduct) {
          return {
            ...image,
          };
        }
      }),
    );
  }

  async deleteImageProduct(imageId: string): Promise<DeleteResult> {
    return await this.productImageRepository.delete(imageId);
  }

  async deleteImagesProduct(imageIds: number[]): Promise<DeleteResult> {
    return await this.productImageRepository.delete({
      id: In(imageIds),
    });
  }

  async updateImageProduct(
    id: number,
    updateProductImage: UpdateProductImage,
  ): Promise<UpdateResult> {
    const image = await this.getImage(id);
    const deleteImage = await this.cloudinaryService.delete(image.image_id);
    if (!deleteImage) throw new BadRequestException('some thing went wrong!');
    return await this.productImageRepository.update(
      { id },
      { ...updateProductImage },
    );
  }

  async getImage(id: number) {
    return await this.productImageRepository.findOneBy({ id });
  }

  async getAllImageByShop(
    shopId: string,
    querySearchImageProduct: QuerySearchImageProduct,
  ) {
    const shop = await this.shopService.checkShopIsActive(shopId);
    const page = parseInt(querySearchImageProduct.page);
    const limit = parseInt(querySearchImageProduct.limit);
    const skip = (page - 1) * limit;
    const [res, total] = await this.productImageRepository.findAndCount({
      where: { shop: shop },
      relations: ['attributes'],
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
