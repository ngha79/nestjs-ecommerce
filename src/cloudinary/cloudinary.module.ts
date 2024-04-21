import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';
import { Services } from 'src/utils/constants';
import { CloudinaryController } from './cloudinary.controller';

@Module({
  controllers: [CloudinaryController],
  providers: [
    CloudinaryProvider,
    {
      provide: Services.IMAGE_UPLOAD_SERVICE,
      useClass: CloudinaryService,
    },
  ],
  exports: [
    CloudinaryProvider,
    {
      provide: Services.IMAGE_UPLOAD_SERVICE,
      useClass: CloudinaryService,
    },
  ],
})
export class CloudinaryModule {}
