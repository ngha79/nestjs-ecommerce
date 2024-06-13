import { Cart } from 'src/entities/cart.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateCartDto } from '../dto/create-cart.dto';
import { UpdateCartDto } from '../dto/update-cart.dto';
import { QueryCartDto } from '../dto/query-cart.dto';
import { DeleteCartDto } from '../dto/delete-cart.dto';

export interface ICartService {
  create(id: string, createCartDto: CreateCartDto): Promise<Cart>;
  findAll(queryCartDto: QueryCartDto): Promise<any>;
  findOneByUser(id: string): Promise<any>;
  findOne(cartId: string): Promise<Cart>;
  update(id: string, updateCart: UpdateCartDto): Promise<UpdateResult>;
  remove(id: string): Promise<boolean>;
  deleteAllCartItems(
    cartId: string,
    deleteCartDto: DeleteCartDto,
  ): Promise<DeleteResult>;
}
