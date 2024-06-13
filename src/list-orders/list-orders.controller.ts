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
import { Services } from 'src/utils/constants';
import { UserRequest } from 'src/user/user.decorator';
import { PayloadToken } from 'src/auth/dto/payload-token.dto';
import { QuerySearchOrder } from './dto/query-search-order.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ICreateListOrders } from './dto/create-list-order.dto';
import { ShopGuard } from 'src/guards/shop.guard';
import { NotificationsService } from 'src/notifications/notifications.service';

@Controller('list-orders')
export class ListOrdersController {
  constructor(
    @Inject(Services.LIST_ORDER)
    private readonly listOrdersService: ListOrdersService,
    @Inject(Services.NOTIFICATION)
    private readonly notificationService: NotificationsService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async createListOrder(
    @UserRequest() user: PayloadToken,
    @Body() createListOrders: ICreateListOrders,
  ) {
    return this.listOrdersService.createListOrder({
      id: user.id,
      ...createListOrders,
    });
  }

  @UseGuards(ShopGuard)
  @Get('shop-list')
  findAllShop(
    @Query() querySearchOrder: QuerySearchOrder,
    @UserRequest() user: PayloadToken,
  ) {
    return this.listOrdersService.findAllShop({
      ...querySearchOrder,
      shopId: user.id,
    });
  }

  @Get('admin-list')
  findAllShopByAdmin(@Query() querySearchOrder: QuerySearchOrder) {
    return this.listOrdersService.findAllShop(querySearchOrder);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(
    @Query() querySearchOrder: QuerySearchOrder,
    @UserRequest() user: PayloadToken,
  ) {
    return this.listOrdersService.findAll({
      ...querySearchOrder,
      userId: user.id,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listOrdersService.findOne(id);
  }

  @UseGuards(ShopGuard)
  @Put('cancel-shop/:id')
  cancelOrderShop(@Param('id') id: string, @UserRequest() user: PayloadToken) {
    return this.listOrdersService.cancelOrder(id, null, user.id);
  }

  @UseGuards(AuthGuard)
  @Put('cancel/:id')
  cancelOrder(@Param('id') id: string, @UserRequest() user: PayloadToken) {
    return this.listOrdersService.cancelOrder(id, user.id);
  }

  @UseGuards(ShopGuard)
  @Put('delivered/:id')
  deliveredOrder(@Param('id') id: string) {
    return this.listOrdersService.deliveredOrder(id);
  }

  @UseGuards(ShopGuard)
  @Put('confirm/:id')
  confirmOrder(@Param('id') id: string) {
    return this.listOrdersService.confirmOrder(id);
  }

  @UseGuards(ShopGuard)
  @Put('shipping/:id')
  shippingOrder(@Param('id') id: string) {
    return this.listOrdersService.shippingOrder(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listOrdersService.remove(id);
  }
}
