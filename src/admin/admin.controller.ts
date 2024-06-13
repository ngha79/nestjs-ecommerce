import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Services } from 'src/utils/constants';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    @Inject(Services.IMAGE_UPLOAD_SERVICE)
    private readonly uploadService: CloudinaryService,
  ) {}

  @Post('slider')
  @UseInterceptors(FilesInterceptor('sliders'))
  async uploadImageSlider(
    @UploadedFiles() sliders?: Array<Express.Multer.File>,
  ) {
    if (!sliders) throw new BadRequestException('File not found!');
    const images = await this.uploadService.uploadFiles([...sliders], {
      fileName: ' sliders',
      folderName: 'admin',
    });
    return await this.adminService.uploadImageSlider(images);
  }

  @Get('slider')
  getSlider() {
    return this.adminService.getSlider();
  }

  @Delete('slider/:id')
  deleteImage(@Param('id') id: number) {
    return this.adminService.deleteImage(id);
  }
}
