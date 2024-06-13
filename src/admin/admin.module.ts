import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEcommerce } from 'src/entities/admin.entity';
import { Shop } from 'src/entities/shop.entity';
import { UserModule } from 'src/user/user.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { SliderEntity } from 'src/entities/slider.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEcommerce, Shop, SliderEntity]),
    UserModule,
    CloudinaryModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
