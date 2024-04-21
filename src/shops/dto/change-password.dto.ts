import { IsEmail, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  userId: string;

  @IsString()
  @MinLength(6)
  currentPassword: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}

export class ChangePasswordShopDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  currentPassword: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}
