import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Inject,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from '../../entities/user.entity';
import { UpdateUser } from '../dto/update-user.dto';
import { DeleteResult } from 'typeorm';
import { SearchUsers } from '../dto/search-users.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UserRequest } from '../user.decorator';
import { PayloadToken } from 'src/auth/dto/payload-token.dto';
import { Services } from 'src/utils/constants';
import { UserService } from '../services/user.service';
import { IChangePassword } from '../dto/change-password';
import { AdminGuard } from 'src/guards/admin.guard';
import { ICreateUser } from '../dto/create-user.dto';
import { ShopGuard } from 'src/guards/shop.guard';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    @Inject(Services.USERS)
    private userService: UserService,
    @Inject(Services.IMAGE_UPLOAD_SERVICE)
    private cloudinaryService: CloudinaryService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'fileAvatar', maxCount: 1 },
      { name: 'fileBackground', maxCount: 1 },
    ]),
  )
  async createUser(
    @Body()
    createUser: ICreateUser,
    @UploadedFiles()
    files: {
      fileAvatar?: Express.Multer.File[];
      fileBackground?: Express.Multer.File[];
    },
  ) {
    try {
      const user = await this.userService.createUser({
        ...createUser,
      });
      const avatar = await this.cloudinaryService.uploadFile(
        files.fileAvatar[0],
        {
          folderName: user.userName,
          fileName: user.userName,
        },
      );
      const background = await this.cloudinaryService.uploadFile(
        files.fileAvatar[0],
        { folderName: user.userName, fileName: user.userName },
      );
      return this.userService.updateProfileUser(user.id, {
        avatar: avatar.secure_url,
        background: background.secure_url,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getProfileUser(@UserRequest() user: PayloadToken): Promise<User> {
    return this.userService.getProfileUser(user);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Put('')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'fileAvatar', maxCount: 1 },
      { name: 'fileBackground', maxCount: 1 },
    ]),
  )
  async updateProfileUser(
    @UserRequest() payload: PayloadToken,
    @Body() updateUser: UpdateUser,
    @UploadedFiles()
    files: {
      fileAvatar?: Express.Multer.File[];
      fileBackground?: Express.Multer.File[];
    },
  ): Promise<User> {
    const user = await this.userService.findUserById(payload.id);
    if (files?.fileAvatar?.length) {
      const avatar = await this.cloudinaryService.uploadFile(
        files.fileAvatar[0],
        {
          folderName: user.userName,
          fileName: user.userName,
        },
      );
      updateUser.avatar = avatar.secure_url;
    }
    if (files?.fileBackground?.length) {
      const background = await this.cloudinaryService.uploadFile(
        files.fileBackground[0],
        { folderName: user.userName, fileName: user.userName },
      );
      updateUser.avatar = background.secure_url;
    }
    return this.userService.updateProfileUser(payload.id, updateUser);
  }

  @UseGuards(AuthGuard)
  @Put('password')
  changePassword(
    @UserRequest() payload: PayloadToken,
    @Body() changePassword: IChangePassword,
  ): Promise<any> {
    return this.userService.changePassword(payload.id, changePassword);
  }

  @UseGuards(ShopGuard)
  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'fileAvatar', maxCount: 1 },
      { name: 'fileBackground', maxCount: 1 },
    ]),
  )
  async updateProfileUserByAdmin(
    @Body() updateUser: UpdateUser,
    @Param('id') id: string,
    @UploadedFiles()
    files: {
      fileAvatar?: Express.Multer.File[];
      fileBackground?: Express.Multer.File[];
    },
  ): Promise<User> {
    const user = await this.userService.findUserById(id);
    if (files?.fileAvatar?.length) {
      const avatar = await this.cloudinaryService.uploadFile(
        files.fileAvatar[0],
        {
          folderName: user.userName,
          fileName: user.userName,
        },
      );
      updateUser.avatar = avatar.secure_url;
    }
    if (files?.fileBackground?.length) {
      const background = await this.cloudinaryService.uploadFile(
        files.fileBackground[0],
        { folderName: user.userName, fileName: user.userName },
      );
      updateUser.background = background.secure_url;
    }
    return this.userService.updateProfileUser(id, updateUser);
  }

  @UseGuards(AuthGuard)
  @Put('update-avatar')
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatarUser(
    @UserRequest() payload: PayloadToken,

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
    const { id } = payload;
    const { url } = await this.cloudinaryService.uploadFile(file, {
      folderName: id,
      fileName: id,
    });
    return this.userService.updateAvatarUser(id, { avatar: url });
  }

  @UseGuards(AuthGuard)
  @Put('update-background')
  @UseInterceptors(FileInterceptor('file'))
  async updateBackgroundUser(
    @UserRequest() payload: PayloadToken,
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
    const { id } = payload;
    const { url } = await this.cloudinaryService.uploadFile(file, {
      folderName: id,
      fileName: id,
    });
    return this.userService.updateAvatarUser(id, { background: url });
  }

  @Get(':id')
  findUserById(@Param('id') id: string): Promise<User> {
    return this.userService.findUserById(id);
  }

  @Get('/profile/:id')
  findProfileUser(@Param('id') id: string): Promise<any> {
    return this.userService.findProfileUser(id);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Delete(':id')
  deleteUserById(@Param('id') id: string): Promise<DeleteResult> {
    return this.userService.deleteUserById(id);
  }

  @Get()
  findAllUser(@Query() querySearch: SearchUsers): Promise<any> {
    return this.userService.findAllUser(querySearch);
  }

  @Get('product/:productId')
  findShopByProduct(@Param('productId') productId: string): Promise<any> {
    return this.userService.findShopByProduct(productId);
  }
}
