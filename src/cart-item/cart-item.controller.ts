import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { Services } from 'src/utils/constants';
import { CartItems } from 'src/entities/cartItem.entity';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { UserRequest } from 'src/user/user.decorator';
import { PayloadToken } from 'src/auth/dto/payload-token.dto';
import { RemoveMultipleCartItem } from './dto/remove-cart-item.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('cart-item')
export class CartItemController {
  constructor(
    @Inject(Services.CART_ITEMS)
    private readonly cartItemService: CartItemService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @UserRequest() user: PayloadToken,
    @Body() createCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartItemService.updateCartItems(user.userId, createCartItemDto);
  }

  @Get('cart:id')
  findAll(@Param('id') id: string): Promise<CartItems[]> {
    return this.cartItemService.findAll(id);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.cartItemService.findOne(id);
  }

  @Patch(':cartId')
  @UseGuards(AuthGuard)
  update(
    @Param('cartId') cartId: string,
    @Body() updateCartItems: UpdateCartItemDto,
  ) {
    return this.cartItemService.update(cartId, updateCartItems);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: number) {
    return this.cartItemService.remove(id);
  }

  @UseGuards(AuthGuard)
  @Delete('')
  removeMultiple(@Body() removeMultipleCartItem: RemoveMultipleCartItem) {
    return this.cartItemService.removeManyCartItems(removeMultipleCartItem.ids);
  }

  @UseGuards(AuthGuard)
  @Delete('all/:cartId')
  removeAllByCart(@Param('cartId') cartId: string) {
    return this.cartItemService.removeAllByCart(cartId);
  }
}
