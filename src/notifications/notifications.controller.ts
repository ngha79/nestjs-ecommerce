import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { FindAllNotificationsDto } from './dto/find-notification.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ShopGuard } from 'src/guards/shop.guard';
import { UserRequest } from 'src/user/user.decorator';
import { PayloadToken } from 'src/auth/dto/payload-token.dto';
import { Services } from 'src/utils/constants';

@Controller('notifications')
export class NotificationsController {
  constructor(
    @Inject(Services.NOTIFICATION)
    private readonly notificationsService: NotificationsService,
  ) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(
    @Query() findAllNotifications: FindAllNotificationsDto,
    @UserRequest() user: PayloadToken,
  ) {
    return this.notificationsService.findAll({
      ...findAllNotifications,
      userReceiverId: user.id,
    });
  }

  @Get('shop')
  @UseGuards(ShopGuard)
  findAllShop(
    @Query() findAllNotifications: FindAllNotificationsDto,
    @UserRequest() user: PayloadToken,
  ) {
    return this.notificationsService.findAll({
      ...findAllNotifications,
      shopReceiverId: user.id,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string) {
    return this.notificationsService.update(id);
  }

  @Patch('shop/:id')
  @UseGuards(ShopGuard)
  updateShop(@Param('id') id: string) {
    return this.notificationsService.update(id);
  }

  @Patch()
  @UseGuards(AuthGuard)
  updateAll(@UserRequest() user: PayloadToken) {
    return this.notificationsService.updateAll(user.id);
  }

  @Patch('shop')
  @UseGuards(ShopGuard)
  updateShopAll(@UserRequest() user: PayloadToken) {
    return this.notificationsService.updateAll(user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }
}
