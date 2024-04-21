import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { CartService } from 'src/cart/cart.service';
import { ProductService } from 'src/product/services/product.service';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CartItems } from 'src/entities/cartItem.entity';
import { Services } from 'src/utils/constants';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { InventoriesService } from 'src/inventories/inventories.service';
import { ICartItemService } from './interfaces/cart-item';

@Injectable()
export class CartItemService implements ICartItemService {
  constructor(
    @InjectRepository(CartItems)
    private readonly cartItemsRepository: Repository<CartItems>,
    @Inject(Services.PRODUCTS)
    private readonly productService: ProductService,
    @Inject(Services.CARTS)
    private readonly cartService: CartService,
    @Inject(Services.INVENTORIES)
    private readonly inventoriesService: InventoriesService,
  ) {}

  async createCartItems(
    createCartItemDto: CreateCartItemDto,
  ): Promise<CartItems> {
    return await this.cartItemsRepository.save({ ...createCartItemDto });
  }

  async updateCartItems(
    userId: string,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<UpdateResult | number> {
    const { total_product, productId } = updateCartItemDto;
    const productAttribute = await this.productService.getProductAttributeById(
      +productId,
    );
    if (!productAttribute)
      throw new NotFoundException(
        "Product wasn't existedproduct that doesn't exist in the market!",
      );
    if (!productAttribute.product.isPublish)
      throw new BadRequestException('The product no longer works!');
    const { stock } = await this.inventoriesService.checkInventory(+productId);
    if (stock <= 0) throw new BadRequestException('Sản phẩm đã hết hàng!');
    if (stock < total_product)
      throw new BadRequestException(
        `Số lượng sản phẩm chỉ còn ${stock}, vui lòng chọn số lượng phù hợp!`,
      );
    let cart = await this.cartService.findOneByUser(userId);
    if (!cart) cart = await this.cartService.create(userId, { cartItems: [] });
    return await this.update(cart?.id, {
      ...updateCartItemDto,
    });
  }

  async findAll(cartId: string): Promise<CartItems[]> {
    return await this.cartItemsRepository
      .createQueryBuilder('cart-items')
      .leftJoinAndSelect('cart-items.product', 'product')
      .where('cart-items.cart = :id', { id: cartId })
      .getMany();
  }

  async findOne(id: number): Promise<CartItems> {
    return await this.cartItemsRepository.findOne({
      where: { id },
      relations: ['product'],
    });
  }

  async update(
    cartId: string,
    { productId, total_product }: UpdateCartItemDto,
  ): Promise<UpdateResult | number> {
    if (!total_product) {
      const productAttribute =
        await this.productService.getProductAttributeById(productId);
      if (!productAttribute.product.isPublish)
        throw new BadRequestException('Số lượng mua không phù hợp.');
      else return await this.remove(productId);
    }
    const cartItem = await this.cartItemsRepository.findOne({
      where: {
        cart: { id: cartId },
        productAttribute: { id: +productId },
      },
    });
    return await this.cartItemsRepository
      .createQueryBuilder()
      .insert()
      .into(CartItems)
      .values({
        cart: { id: cartId },
        productAttribute: { id: +productId },
        total_product,
        id: cartItem?.id,
      })
      .orUpdate(['total_product'], ['id'])
      .execute();
  }

  async remove(id: number): Promise<number> {
    return (await this.cartItemsRepository.delete({ productAttribute: { id } }))
      .affected;
  }

  async removeAllByCart(cartId: string): Promise<DeleteResult> {
    return await this.cartItemsRepository
      .createQueryBuilder()
      .delete()
      .from(CartItems)
      .where('cart.id = :id', { id: cartId })
      .execute();
  }

  async removeManyCartItems(cartId: number[]): Promise<DeleteResult> {
    return await this.cartItemsRepository
      .createQueryBuilder()
      .delete()
      .from(CartItems)
      .where('id IN (:...id)', { id: cartId })
      .execute();
  }
}
