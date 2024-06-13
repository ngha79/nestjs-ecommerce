import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { CartItemModule } from './cart-item/cart-item.module';
import { InventoriesModule } from './inventories/inventories.module';
import { ReservationModule } from './reservation/reservation.module';
import { OrdersModule } from './orders/orders.module';
import { DiscountsModule } from './discounts/discounts.module';
import { FollowUsersModule } from './follow-users/follow-users.module';
import { ListOrdersModule } from './list-orders/list-orders.module';
import { CacheModule } from '@nestjs/cache-manager';
import { AdminModule } from './admin/admin.module';
import { CommentProductModule } from './comment-product/comment-product.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { DatabaseModule } from './database/database.module';
import { BlogModule } from './blog/blog.module';
import { MailerModule } from './mailer/mailer.module';
import { ConversationModule } from './conversation/conversation.module';
import { GatewayModule } from './adapters/gateway.module';
import { NotificationsModule } from './notifications/notifications.module';
import { EventsModule } from './events/events.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ReportModule } from './report/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UserModule,
    AuthModule,
    CloudinaryModule,
    ProductModule,
    CartModule,
    CartItemModule,
    InventoriesModule,
    ReservationModule,
    OrdersModule,
    DiscountsModule,
    FollowUsersModule,
    ListOrdersModule,
    CacheModule.register({ isGlobal: true }),
    AdminModule,
    CommentProductModule,
    WishlistModule,
    BlogModule,
    MailerModule,
    ConversationModule,
    GatewayModule,
    NotificationsModule,
    EventEmitterModule.forRoot(),
    EventsModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
