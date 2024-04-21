import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @MinLength(2)
  userName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(10)
  phoneNumber: string;

  @IsString()
  avatar?: string;

  @IsString()
  background?: string;

  @IsNotEmpty()
  @IsString()
  dateOfBirdth: Date;
}
