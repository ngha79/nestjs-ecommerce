import { CartItems } from 'src/entities/cartItem.entity';
import { UpdateResult, DeleteResult } from 'typeorm';
import { CreateCartItemDto } from '../dto/create-cart-item.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';

export interface ICartItemService {
  createCartItems(createCartItemDto: CreateCartItemDto): Promise<CartItems>;
  updateCartItems(
    id: string,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<UpdateResult | number>;
  findAll(cartId: string): Promise<CartItems[]>;
  findOne(id: number): Promise<CartItems>;
  update(
    cartId: string,
    { productId, total_product }: UpdateCartItemDto,
  ): Promise<UpdateResult | number>;
  remove(id: number): Promise<number>;
  removeAllByCart(cartId: string): Promise<DeleteResult>;
  removeManyCartItems(cartId: number[]): Promise<DeleteResult>;
}
