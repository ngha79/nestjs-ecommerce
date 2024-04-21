import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  @ApiProperty({ description: 'Email:' })
  email: string;

  @IsString()
  @ApiProperty({ description: 'User name:' })
  userName: string;

  @IsString()
  @Length(6, 20, {
    message: 'Mật khẩu phải từ 6 kí tự trở lên hoặc ít hơn 20 kí tự.',
  })
  @ApiProperty({ description: 'Password:' })
  password: string;

  @IsString()
  @ApiProperty({ description: 'Phone number:' })
  phoneNumber: string;
}
