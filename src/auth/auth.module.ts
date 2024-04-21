import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { KeyToken } from 'src/entities/keytoken.entity';
import { ConfigModule } from '@nestjs/config';
import { CartModule } from 'src/cart/cart.module';
import { Shop } from 'src/entities/shop.entity';
import { RefreshTokenUsed } from 'src/entities/refresh-token-used.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, KeyToken, Shop, RefreshTokenUsed]),
    JwtModule.register({
      global: true,
    }),
    ConfigModule,
    CartModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
