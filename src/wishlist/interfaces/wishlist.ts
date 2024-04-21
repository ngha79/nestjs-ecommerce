import { WishtListProduct } from 'src/entities/wishlist-user.entity';
import { AddProductToWishListDto } from '../dtos/add-product-wishlist.dto';
import { GetListWishList } from '../dtos/get-list-wishlist.dto';
import { DeleteResult } from 'typeorm';
import { RemoveProductToWishlistDto } from '../dtos/remove-product-wishlist.dto';

export interface IWishlistService {
  addProductToWishList(
    addProductToWishList: AddProductToWishListDto,
  ): Promise<WishtListProduct>;
  findProductWishList(
    addProductToWishList: AddProductToWishListDto,
  ): Promise<WishtListProduct>;
  removeProductToWishList(
    removeProductToWishList: RemoveProductToWishlistDto,
  ): Promise<DeleteResult>;
  getListWishlist(getListWishList: GetListWishList): Promise<any>;
}
