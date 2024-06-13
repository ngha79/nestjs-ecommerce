import { BadRequestException, Injectable } from '@nestjs/common';
import { IWishlistService } from './interfaces/wishlist';
import { WishtListProduct } from 'src/entities/wishlist-user.entity';
import { DeleteResult, In, Like, Repository } from 'typeorm';
import {
  AddProductsToWishListDto,
  AddProductToWishListDto,
} from './dtos/add-product-wishlist.dto';
import { GetListWishList } from './dtos/get-list-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RemoveProductToWishlistDto } from './dtos/remove-product-wishlist.dto';

@Injectable()
export class WishlistService implements IWishlistService {
  constructor(
    @InjectRepository(WishtListProduct)
    private readonly wishlistRepo: Repository<WishtListProduct>,
  ) {}

  async findProductWishList({
    productId,
    id,
  }: AddProductToWishListDto): Promise<WishtListProduct> {
    return await this.wishlistRepo.findOneBy({
      product: { id: productId },
      user: { id },
    });
  }

  async addProductToWishList({
    productId,
    id,
  }: AddProductToWishListDto): Promise<WishtListProduct> {
    const checkItemIsExist = await this.findProductWishList({
      productId,
      id,
    });
    if (checkItemIsExist)
      throw new BadRequestException(
        'Bạn đã thêm sản phẩm vào sản phẩm yêu thích.',
      );
    return await this.wishlistRepo.save({
      product: { id: productId },
      user: { id },
    });
  }

  async addProductsToWishList({
    productIds,
    id,
  }: AddProductsToWishListDto): Promise<any> {
    return await Promise.all(
      productIds.map(async (productId: string) => {
        const checkItemIsExist = await this.findProductWishList({
          productId,
          id,
        });
        if (!checkItemIsExist)
          return await this.wishlistRepo.save({
            product: { id: productId },
            user: { id },
          });
      }),
    );
  }

  async removeProductToWishList({
    ids,
  }: RemoveProductToWishlistDto): Promise<DeleteResult> {
    return await this.wishlistRepo.delete({
      id: In([ids]),
    });
  }

  async getListWishlist(getListWishList: GetListWishList): Promise<any> {
    const { search, id, limit, page } = getListWishList;
    const take = parseInt(limit);
    const takePage = parseInt(page);
    const skip = take * (takePage - 1);
    const [res, total] = await this.wishlistRepo.findAndCount({
      where: [
        {
          product: {
            slug: Like('%' + search + '%'),
          },
          user: { id: id },
        },
      ],
      take: take,
      skip: skip,
      relations: ['product', 'product.picture'],
    });
    const lastPage = Math.floor(total / take);
    const nextPage = takePage >= lastPage ? null : takePage + 1;
    const prevPage = takePage - 1 < 1 ? null : takePage - 1;
    return {
      data: res,
      lastPage,
      nextPage,
      prevPage,
    };
  }
}
