import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/entities/cart.entity';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { CartItems } from 'src/entities/cartItem.entity';
import { CartItemService } from 'src/cart-item/cart-item.service';
import { Services } from 'src/utils/constants';
import { UpdateCartDto } from './dto/update-cart.dto';
import { DeleteCartDto } from './dto/delete-cart.dto';
import { QueryCartDto } from './dto/query-cart.dto';
import { extractShopAndProductInfo } from 'src/utils/helper';
import { ICartService } from './interfaces/cart';

@Injectable()
export class CartService implements ICartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @Inject(forwardRef(() => Services.CART_ITEMS))
    private readonly cartItemService: CartItemService,
    private dataSource: DataSource,
  ) {}

  async create(userId: string, createCartDto: CreateCartDto): Promise<Cart> {
    return await this.cartRepository.save({
      ...createCartDto,
      user: { id: userId },
    });
  }

  async findAll(queryCartDto: QueryCartDto): Promise<any> {
    const page = parseInt(queryCartDto.page) - 1;
    const take = parseInt(queryCartDto.limit_per_page);
    const skip = page * take;
    const [res, total] = await this.cartRepository.findAndCount({
      take: take | 20,
      skip: skip | 0,
    });
    const lastPage = Math.floor(total / take) | 1;
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;
    return {
      data: res,
      lastPage,
      nextPage,
      prevPage,
    };
  }

  async findOneByUser(userId: string): Promise<any> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: [
        'cartItems',
        'cartItems.productAttribute',
        'cartItems.productAttribute.product',
        'cartItems.productAttribute.product.shop',
      ],
    });
    if (!cart) return null;
    const result = extractShopAndProductInfo(cart.cartItems);
    return { ...cart, cartItems: result };
  }

  async findOne(cartId: string): Promise<Cart> {
    return await this.cartRepository.findOne({
      where: { id: cartId },
      relations: [
        'cartItems',
        'cartItems.productAttribute',
        'cartItems.productAttribute.product',
        'user',
      ],
    });
  }

  async update(id: string, updateCart: UpdateCartDto) {
    return await this.cartRepository.update({ id }, { ...updateCart });
  }

  async deleteAllCartItems(
    cartId: string,
    { isDeleteAll, ids }: DeleteCartDto,
  ): Promise<DeleteResult> {
    if (isDeleteAll) {
      return await this.cartItemService.removeAllByCart(cartId);
    }
    return await this.cartItemService.removeManyCartItems(ids);
  }

  async remove(id: string): Promise<boolean> {
    const cart = await this.findOne(id);
    if (!cart) return false;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.delete(CartItems, { cart: cart });
      await queryRunner.manager.delete(Cart, { id: id });
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      await queryRunner.release();
    }
    return true;
  }
}
