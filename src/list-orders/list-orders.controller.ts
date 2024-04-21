import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  Query,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ListOrdersService } from './list-orders.service';
import { UpdateListOrderDto } from './dto/update-list-order.dto';
import { Services } from 'src/utils/constants';
import { UserRequest } from 'src/user/user.decorator';
import { PayloadToken } from 'src/auth/dto/payload-token.dto';
import { QuerySearchOrder } from './dto/query-search-order.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ICreateListOrders } from './dto/create-list-order.dto';
import { ShopGuard } from 'src/guards/shop.guard';

@Controller('list-orders')
export class ListOrdersController {
  constructor(
    @Inject(Services.LIST_ORDER)
    private readonly listOrdersService: ListOrdersService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  createListOrder(
    @UserRequest() user: PayloadToken,
    @Body() createListOrders: ICreateListOrders,
  ) {
    return this.listOrdersService.createListOrder({
      userId: user.userId,
      ...createListOrders,
    });
  }

  @UseGuards(ShopGuard)
  @Get('shop-list')
  findAllShop(@Query() querySearchOrder: QuerySearchOrder) {
    return this.listOrdersService.findAllShop(querySearchOrder);
  }

  @Get()
  findAll(@Query() querySearchOrder: QuerySearchOrder) {
    return this.listOrdersService.findAll(querySearchOrder);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listOrdersService.findOne(id);
  }

  @UseGuards(ShopGuard)
  @Put(':id')
  updateStatus(
    @Param('id') id: string,
    @Body() updateListOrderDto: UpdateListOrderDto,
  ) {
    return this.listOrdersService.updateStatus(id, updateListOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listOrdersService.remove(id);
  }
}
