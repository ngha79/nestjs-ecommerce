import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
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

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot({ isGlobal: true }),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
