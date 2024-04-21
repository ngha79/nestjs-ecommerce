import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Inject,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Services } from 'src/utils/constants';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  IUploadImageFromLocal,
  IUploadImageFromUrl,
} from './dto/cloudinary.dto';

@Controller('upload-file')
export class CloudinaryController {
  constructor(
    @Inject(Services.IMAGE_UPLOAD_SERVICE)
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @Body() uploadImageFromLocal: IUploadImageFromLocal,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.cloudinaryService.uploadFile(file, uploadImageFromLocal);
  }

  @Post('url')
  @UseInterceptors(FileInterceptor('file'))
  uploadImageFromUrl(@Body() uploadImageFromUrl: IUploadImageFromUrl) {
    return this.cloudinaryService.uploadImageFromUrl(uploadImageFromUrl);
  }

  @Post('uploads')
  @UseInterceptors(FilesInterceptor('items', 5))
  uploadImageFromLocal(
    @Body() uploadImageFromLocal: IUploadImageFromLocal,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    images: Express.Multer.File[],
  ) {
    return this.cloudinaryService.uploadImageFromLocal(
      images,
      uploadImageFromLocal,
    );
  }
}
