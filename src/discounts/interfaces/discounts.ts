import { Discount, DiscountType } from 'src/entities/discount.entity';
import { UpdateResult, DeleteResult } from 'typeorm';
import { ApplyDiscountCode } from '../dto/apply-discount-to-product.dto';
import { CreateDiscountDto } from '../dto/create-discount.dto';
import { QuerySearchDiscount } from '../dto/query-search-discount.dto';
import { UpdateDiscountDto } from '../dto/update-discount.dto';

export interface IDiscountsService {
  create(
    shopId: string,
    createDiscountDto: CreateDiscountDto,
  ): Promise<Discount>;
  findAll(querySearchDiscount: QuerySearchDiscount): Promise<any>;
  findOne(code: string): Promise<Discount>;
  findOneActive(code: string, shopId: string): Promise<Discount>;
  update(
    id: string,
    updateDiscountDto: UpdateDiscountDto,
  ): Promise<UpdateResult>;
  activeDiscounts(ids: string[]): Promise<UpdateResult>;
  unactiveDiscounts(ids: string[]): Promise<UpdateResult>;
  remove(id: string): Promise<DeleteResult>;
  applyDiscountToProduct(applyDiscountCode: ApplyDiscountCode): Promise<any>;
  getPriceProduct(
    priceProduct: number,
    discount_value: number,
    type_discount: DiscountType,
  );
}
