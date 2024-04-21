import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEcommerce } from 'src/entities/admin.entity';
import { Shop } from 'src/entities/shop.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEcommerce, Shop]), UserModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
