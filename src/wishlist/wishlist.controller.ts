import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Services } from 'src/utils/constants';
import { WishlistService } from './wishlist.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { AddProductToWishListDto } from './dtos/add-product-wishlist.dto';
import { WishtListProduct } from 'src/entities/wishlist-user.entity';
import { RemoveProductToWishlistDto } from './dtos/remove-product-wishlist.dto';
import { DeleteResult } from 'typeorm';
import { GetListWishList } from './dtos/get-list-wishlist.dto';
import { UserRequest } from 'src/user/user.decorator';
import { PayloadToken } from 'src/auth/dto/payload-token.dto';

@UseGuards(AuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(
    @Inject(Services.WISHLIST) private wishlistService: WishlistService,
  ) {}

  @Post('')
  addProductToWishList(
    @Body() addProductToWishList: AddProductToWishListDto,
    @UserRequest() user: PayloadToken,
  ): Promise<WishtListProduct> {
    return this.wishlistService.addProductToWishList({
      ...addProductToWishList,
      userId: user.userId,
    });
  }

  @Delete('')
  removeProductToWishList(
    @Body() removeProductToWishList: RemoveProductToWishlistDto,
  ): Promise<DeleteResult> {
    return this.wishlistService.removeProductToWishList(
      removeProductToWishList,
    );
  }

  @Get('')
  getListWishlist(
    @Query() getListWishList: GetListWishList,
    @UserRequest() user: PayloadToken,
  ): Promise<WishtListProduct> {
    return this.wishlistService.getListWishlist({
      ...getListWishList,
      userId: user.userId,
    });
  }
}
