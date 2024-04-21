import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
  UseGuards,
  Put,
} from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { Services } from 'src/utils/constants';
import { QuerySearchDiscount } from './dto/query-search-discount.dto';
import { ShopGuard } from 'src/guards/shop.guard';
import { UserRequest } from 'src/user/user.decorator';
import { PayloadToken } from 'src/auth/dto/payload-token.dto';
import { ActiveDiscountsDTO } from './dto/active-discounts.dto';

@Controller('discounts')
export class DiscountsController {
  constructor(
    @Inject(Services.DISCOUNT)
    private readonly discountsService: DiscountsService,
  ) {}

  @UseGuards(ShopGuard)
  @Post()
  create(
    @UserRequest() user: PayloadToken,
    @Body() createDiscountDto: CreateDiscountDto,
  ) {
    return this.discountsService.create(user.userId, createDiscountDto);
  }

  @Get()
  findAll(@Query() querySearchDiscount: QuerySearchDiscount) {
    return this.discountsService.findAll(querySearchDiscount);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.discountsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ) {
    return this.discountsService.update(id, updateDiscountDto);
  }

  @Patch('active')
  activeDiscount(@Body('') activeDiscountsDTO: ActiveDiscountsDTO) {
    return this.discountsService.activeDiscounts(activeDiscountsDTO.ids);
  }

  @Patch('unactive')
  unactiveDiscount(@Body('') activeDiscountsDTO: ActiveDiscountsDTO) {
    return this.discountsService.unactiveDiscounts(activeDiscountsDTO.ids);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.discountsService.remove(id);
  }
}
