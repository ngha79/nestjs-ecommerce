import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Discount,
  DiscountApplyType,
  DiscountType,
} from 'src/entities/discount.entity';
import { DeleteResult, In, Like, Repository, UpdateResult } from 'typeorm';
import { QuerySearchDiscount } from './dto/query-search-discount.dto';
import { ApplyDiscountCode } from './dto/apply-discount-to-product.dto';
import { DiscountUserUsed } from 'src/entities/discountUserUsed.entity';
import { ProductAttribute } from 'src/entities/productAttribute.entity';
import { IDiscountsService } from './interfaces/discounts';

@Injectable()
export class DiscountsService implements IDiscountsService {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
    @InjectRepository(ProductAttribute)
    private readonly productAttributeRepository: Repository<ProductAttribute>,
    @InjectRepository(DiscountUserUsed)
    private readonly discountUserUsedRepository: Repository<DiscountUserUsed>,
  ) {}

  async create(
    shopId: string,
    createDiscountDto: CreateDiscountDto,
  ): Promise<Discount> {
    const checkDiscount = await this.findOneByCode(
      createDiscountDto.discount_code,
    );
    if (checkDiscount) throw new BadRequestException('Mã giảm giá đã tồn tại!');
    if (
      new Date(createDiscountDto.discount_start_date) >
        new Date(createDiscountDto.discount_end_date) ||
      new Date(createDiscountDto.discount_end_date) < new Date()
    )
      throw new BadRequestException('Thời gian không hợp lệ!');
    if (
      createDiscountDto.discount_type === DiscountType.PERCENT &&
      createDiscountDto.discount_value > 100
    )
      throw new BadRequestException('Phần trăm giảm giá phải nhỏ hơn 100%!');
    return await this.discountRepository.save({
      ...createDiscountDto,
      discount_shop: { id: shopId },
    });
  }

  async findAll({
    limit,
    page,
    search,
    shopId,
    isActive,
  }: QuerySearchDiscount): Promise<any> {
    const skip = (+page - 1) * +limit;
    const [res, total] = await this.discountRepository.findAndCount({
      where: [
        {
          discount_code: Like(`%${search}%`),
          discount_shop: { id: shopId },
          discount_is_active: isActive ? isActive : undefined,
        },
        {
          discount_name: Like(`%${search}%`),
          discount_shop: { id: shopId },
          discount_is_active: isActive ? isActive : undefined,
        },
        {
          discount_description: Like(`%${search}%`),
          discount_shop: { id: shopId },
          discount_is_active: isActive ? isActive : undefined,
        },
      ],
      skip: skip,
      take: limit,
      relations: ['discount_shop'],
      select: {
        ...Discount,
        discount_shop: {
          id: true,
          userName: true,
          avatar: true,
          background: true,
        },
      },
    });

    const lastPage = Math.ceil(total / +limit);
    const prevPage = +page >= 1 ? null : +page - 1;
    const nextPage = +page >= lastPage ? null : +page + 1;
    return {
      data: res,
      nextPage,
      lastPage,
      prevPage,
    };
  }

  async findOneByCode(code: string): Promise<Discount> {
    return await this.discountRepository.findOne({
      where: { discount_code: code },
    });
  }

  async findOne(id: string): Promise<Discount> {
    return await this.discountRepository.findOne({
      where: { id },
    });
  }

  async findOneActive(code: string, shopId: string): Promise<Discount> {
    return await this.discountRepository.findOne({
      where: {
        discount_code: code,
        discount_is_active: true,
        discount_shop: { id: shopId },
      },
    });
  }

  async update(
    id: string,
    updateDiscountDto: UpdateDiscountDto,
  ): Promise<UpdateResult> {
    const { discount_user_used, ...data } = updateDiscountDto;
    if (discount_user_used) {
      await this.discountUserUsedRepository
        .createQueryBuilder('discount_user_used')
        .delete()
        .where('discount_user_used.user = :id', { id });
    }
    return await this.discountRepository.update({ id }, { ...data });
  }

  async activeDiscounts(ids: string[]): Promise<UpdateResult> {
    return await this.discountRepository.update(
      { id: In(ids) },
      { discount_is_active: true },
    );
  }

  async unactiveDiscounts(ids: string[]): Promise<UpdateResult> {
    return await this.discountRepository.update(
      { id: In(ids) },
      { discount_is_active: false },
    );
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.discountRepository.delete({ id });
  }

  // async getDiscountAmount({ codeId, shopId, userId, products }) {
  //   const foundDiscount = await this.findOneActive(codeId, shopId);

  //   if (!foundDiscount) throw new BadRequestException('Discount not exist!');
  //   const {
  //     discount_is_active,
  //     discount_max_uses,
  //     discount_min_order_value,
  //     discount_start_date,
  //     discount_end_date,
  //     discount_user_used,
  //     discount_type,
  //     discount_value,
  //     discount_max_value,
  //   } = foundDiscount;
  //   if (!discount_is_active) throw new BadRequestException('Discount expired!');
  //   if (!discount_max_uses) throw new BadRequestException('Discount are out!');

  //   if (
  //     new Date() < new Date(discount_start_date) ||
  //     new Date() > new Date(discount_end_date)
  //   ) {
  //     throw new BadRequestException('Discount ecode has expired!');
  //   }

  //   let totalOrder = 0;
  //   if (discount_min_order_value > 0) {
  //     totalOrder = products.reduce((acc, product) => {
  //       return acc + product.quantity * product.price;
  //     }, 0);

  //     if (totalOrder < discount_min_order_value) {
  //       throw new BadRequestException(
  //         `Discount requries a minium oder value of ${discount_min_order_value}`,
  //       );
  //     }
  //   }

  //   if (discount_max_uses > 0) {
  //     const userUseDiscount = discount_user_used.find(
  //       (user) => user.user.id === userId,
  //     );
  //     if (userUseDiscount) {
  //       throw new BadRequestException('Discount used!');
  //     }
  //   }

  //   let amount =
  //     discount_type === 'value'
  //       ? discount_value
  //       : totalOrder * (discount_value / 100);
  //   if (discount_max_value < amount) {
  //     amount = discount_max_value;
  //   }
  //   return {
  //     totalOrder,
  //     discount: amount * products.length,
  //     totalPrice: totalOrder - amount * products.length,
  //   };
  // }

  async applyDiscountToProduct(
    applyDiscountCode: ApplyDiscountCode,
  ): Promise<any> {
    const discount = await this.findOneActive(
      applyDiscountCode.codeId,
      applyDiscountCode.shopId,
    );

    if (!discount)
      throw new BadRequestException(
        `Mã giảm giá ${applyDiscountCode.codeId} không tồn tại!`,
      );

    if (new Date(discount.discount_start_date) > new Date())
      throw new BadRequestException('Mã giảm giá chưa được áp dụng!');

    if (new Date() > new Date(discount.discount_end_date))
      throw new BadRequestException('Mã giảm giá hết thời gian áp dụng!');

    // const user = await this.discountUserUsedRepository.findOne({
    //   where: { user: { id: applyDiscountCode.userId } },
    // });

    // if (user.total_used >= discount.discount_uses_per_user) {
    //   throw new BadRequestException('You used max!');
    // }

    const productIds = applyDiscountCode.products.map(
      (item) => item.productAttribute.id,
    );

    const products = await this.productAttributeRepository.find({
      where: { id: In(productIds) },
      relations: ['product'],
    });
    const result = {
      total_price: 0,
      total_price_apply_discount: 0,
      product_new: [],
    };
    applyDiscountCode.products.forEach((productId) => {
      const { quantity } = productId;
      const productAttribute = products.find(
        (item) => item.id === productId.productAttribute.id,
      );
      const {
        product: { price, id },
      } = productAttribute;

      let totalPrice = 0;
      if (
        discount.discount_apply_type === DiscountApplyType.SPECIFIC &&
        !discount.discount_product_apply_to?.find((prod) => prod.id === id)
      ) {
        totalPrice = price * quantity;
      } else {
        if (price < discount.discount_min_order_value) {
          totalPrice = price;
        } else {
          totalPrice = this.getPriceProduct(
            price,
            discount.discount_value,
            discount.discount_type,
          );
        }

        result.total_price += price * quantity;
        result.total_price_apply_discount += totalPrice * quantity;
      }

      result.product_new.push({
        productAttribute,
        total_price: price * quantity,
        total_price_apply: Math.min(
          discount.discount_max_value,
          totalPrice * quantity,
        ),
        quantity: quantity,
      });
    });

    return result;
  }

  getPriceProduct(
    priceProduct: number,
    discount_value: number,
    type_discount: DiscountType,
  ) {
    if (type_discount === DiscountType.PERCENT) {
      return Math.floor((priceProduct * (100 - discount_value)) / 100);
    }
    return discount_value;
  }
}
