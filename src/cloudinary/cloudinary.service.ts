import { BadRequestException, Injectable } from '@nestjs/common';
import { CloudinaryResponse } from './cloudinary-response';
import { v2 as cloudinary } from 'cloudinary';
import {
  IUploadImageFromLocal,
  IUploadImageFromUrl,
} from './dto/cloudinary.dto';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  uploadFile(
    file: Express.Multer.File | null,
    { folderName, fileName }: IUploadImageFromLocal,
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: folderName, public_id: fileName },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadFiles(
    files: Express.Multer.File[],
    { folderName, fileName }: IUploadImageFromLocal,
  ) {
    const urls = await Promise.all(
      files.map(async (file): Promise<string> => {
        const { secure_url } = await this.uploadFile(file, {
          folderName,
          fileName,
        });
        return secure_url;
      }),
    );
    return urls;
  }

  async uploadImageFromUrl({ url, fileName, folderName }: IUploadImageFromUrl) {
    try {
      const result = await cloudinary.uploader.upload(url, {
        public_id: fileName,
        folder: folderName,
      });
      return {
        image_url: result.url,
        thumb_url: await cloudinary.url(result.public_id, {
          width: 100,
          height: 100,
          format: 'jpg',
        }),
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async uploadImageFromLocal(
    files: Array<Express.Multer.File>,
    { fileName, folderName }: IUploadImageFromLocal,
  ) {
    try {
      const arrayImages = [];
      for (const file of files) {
        const image = await this.uploadFile(file, {
          fileName,
          folderName,
        });
        arrayImages.push(image);
      }
      return arrayImages;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async delete(imageId: string) {
    return await cloudinary.uploader.destroy(imageId);
  }

  async deleteList(imageIds: string[]) {
    return await cloudinary.api.delete_resources(imageIds);
  }
}
