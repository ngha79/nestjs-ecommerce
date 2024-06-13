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
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UserRequest } from 'src/user/user.decorator';
import { PayloadToken } from 'src/auth/dto/payload-token.dto';
import { Services } from 'src/utils/constants';
import { UpdateCartDto } from './dto/update-cart.dto';
import { QueryCartDto } from './dto/query-cart.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('carts')
export class CartController {
  constructor(
    @Inject(Services.CARTS)
    private readonly cartService: CartService,
  ) {}

  @Post()
  create(
    @UserRequest() user: PayloadToken,
    @Body() createCartDto: CreateCartDto,
  ) {
    return this.cartService.create(user.id, createCartDto);
  }

  @Get('list')
  findAll(@Body() queryCartDto: QueryCartDto) {
    return this.cartService.findAll(queryCartDto);
  }

  @Get('')
  findOneUser(@UserRequest() user: PayloadToken) {
    return this.cartService.findOneByUser(user.id);
  }

  @Get('user/:id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCart: UpdateCartDto) {
    return this.cartService.update(id, updateCart);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(id);
  }
}
