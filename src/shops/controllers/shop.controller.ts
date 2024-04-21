import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ShopService } from '../services/shop.service';
import { CreateShopDto } from '../dto/create-shop.dto';
import { Shop } from 'src/entities/shop.entity';
import { UpdateShopDto } from '../dto/update-shop.dto';
import { AuthUser } from 'src/utils/decorators';
import { PayloadToken } from 'src/auth/dto/payload-token.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { FindShopParams } from 'src/utils/types';
import { Services } from 'src/utils/constants';
import { ShopGuard } from 'src/guards/shop.guard';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpdateStatusShopDTO } from '../dto/update-status-shop';
import { CreateShopAdminDto } from '../dto/create-shop-admin';
import { AddressShopService } from '../services/address.service';
import {
  ChangePasswordDto,
  ChangePasswordShopDto,
} from '../dto/change-password.dto';

@Controller('shop')
export class ShopController {
  constructor(
    @Inject(Services.SHOPS)
    private readonly shopService: ShopService,
    @Inject(Services.ADDRESS_SHOP)
    private readonly addressShopService: AddressShopService,
    @Inject(Services.IMAGE_UPLOAD_SERVICE)
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  createShop(@Body() createShop: CreateShopDto): Promise<Shop> {
    return this.shopService.createShop(createShop);
  }

  @Post('admin')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'fileAvatar', maxCount: 1 },
      { name: 'fileBackground', maxCount: 1 },
    ]),
  )
  async createShopByAdmin(
    @Body() createShopAdmin: CreateShopAdminDto,
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File;
      background?: Express.Multer.File;
    },
  ): Promise<Shop> {
    const checkShop = await this.shopService.createShopAdmin(createShopAdmin);
    if (files?.avatar) {
      const image = await this.cloudinaryService.uploadFile(files.avatar[0], {
        folderName: checkShop.email,
      });

      if (!image)
        throw new BadRequestException('Có lỗi xảy ra khi tạo người dùng.');
      checkShop.avatar = image.secure_url;
    }
    if (files?.background) {
      const image = await this.cloudinaryService.uploadFile(
        files.background[0],
        {
          folderName: checkShop.email,
        },
      );
      if (!image)
        throw new BadRequestException('Có lỗi xảy ra khi tạo người dùng.');
      checkShop.background = image.secure_url;
    }
    const newShop = await this.shopService.saveShop(checkShop);
    const addressData = JSON.parse(createShopAdmin.address);
    await this.addressShopService.createAddressShop({
      ...addressData,
      shop: newShop,
    });
    return newShop;
  }

  @Get(':id')
  @UseGuards(ShopGuard)
  findShopById(@Param('id') id: string): Promise<Shop> {
    return this.shopService.findShopById(id);
  }

  @Get('info/:id')
  getInfoShop(@Param('id') id: string): Promise<Shop> {
    return this.shopService.findProfileShopById(id);
  }

  @Put('profile')
  @UseGuards(ShopGuard)
  profileShop(@AuthUser() shop: PayloadToken): Promise<Shop> {
    return this.shopService.profileShop(shop.userId);
  }

  @Put()
  @UseGuards(ShopGuard)
  async updateShop(
    @AuthUser() shop: PayloadToken,
    @Body() update: UpdateShopDto,
  ): Promise<Shop> {
    const shopInfo = await this.findShopById(shop.userId);
    return this.shopService.updateShop(shopInfo, update);
  }

  @Put('admin/:shopId')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'fileAvatar', maxCount: 1 },
      { name: 'fileBackground', maxCount: 1 },
    ]),
  )
  async updateShopByAdmin(
    @Param('shopId') shopId: string,
    @Body() update: UpdateShopDto,
    @UploadedFiles()
    files: {
      fileAvatar?: Express.Multer.File[];
      fileBackground?: Express.Multer.File[];
    },
  ): Promise<Shop> {
    const shopInfo = await this.findShopById(shopId);
    if (files?.fileAvatar?.length) {
      const avatar = await this.cloudinaryService.uploadFile(
        files.fileAvatar[0],
        {
          folderName: shopInfo.userName,
          fileName: shopInfo.userName,
        },
      );
      update.avatar = avatar.secure_url;
    }
    if (files?.fileBackground?.length) {
      const background = await this.cloudinaryService.uploadFile(
        files.fileBackground[0],
        { folderName: shopInfo.userName, fileName: shopInfo.userName },
      );
      update.background = background.secure_url;
    }
    const address = JSON.parse(update.addressUpdate as string);
    await this.addressShopService.createAddressShop({
      ...address,
      shop: shopInfo,
    });
    return this.shopService.updateShop(shopInfo, update);
  }

  @Post('avatar')
  @UseGuards(ShopGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @AuthUser() shop: PayloadToken,
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<Shop> {
    const shopInfo = await this.findShopById(shop.userId);
    if (!file) throw new BadRequestException('File is empty');
    const image = await this.cloudinaryService.uploadFile(file, {
      folderName: shopInfo.userName,
    });
    if (!image) throw new BadRequestException('Upload file failed');
    return this.shopService.updateShop(shopInfo, {
      avatar: image.secure_url,
    });
  }

  @Post('background')
  @UseGuards(ShopGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateBackground(
    @AuthUser() shop: PayloadToken,
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<Shop> {
    const shopInfo = await this.findShopById(shop.userId);
    if (!file) throw new BadRequestException('File is empty');
    const image = await this.cloudinaryService.uploadFile(file, {
      folderName: shopInfo.userName,
    });
    if (!image) throw new BadRequestException('Upload file failed');
    return this.shopService.updateShop(shopInfo, {
      background: image.secure_url,
    });
  }

  @Delete(':id')
  @UseGuards(ShopGuard)
  deleteShop(@Param('id') id: string): Promise<DeleteResult> {
    return this.shopService.deleteShop(id);
  }

  @Get('')
  findShop(@Query() params: FindShopParams): Promise<any> {
    return this.shopService.findShop(params);
  }

  @Get('product/:productId')
  findShopByProduct(@Param('productId') productId: string): Promise<any> {
    return this.shopService.findShopByProduct(productId);
  }

  @Put('status')
  updateStatusShop(
    @Body() updateStatusShopDTO: UpdateStatusShopDTO,
  ): Promise<UpdateResult> {
    return this.shopService.updateStatusShop(updateStatusShopDTO);
  }

  @Put('change-password')
  @UseGuards(ShopGuard)
  changePassword(
    @AuthUser() shop: PayloadToken,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<Shop> {
    return this.shopService.changePassword({
      ...changePasswordDto,
      userId: shop.userId,
    });
  }

  @Put('change-password-login')
  changePasswordShop(
    @Body() changePasswordShopDto: ChangePasswordShopDto,
  ): Promise<Shop> {
    return this.shopService.changePasswordShop(changePasswordShopDto);
  }
}
