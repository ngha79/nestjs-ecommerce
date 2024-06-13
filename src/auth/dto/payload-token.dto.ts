import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class PayloadToken {
  @IsString()
  @ApiProperty()
  id: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @IsString()
  @ApiProperty()
  userName: string;

  @IsString()
  @ApiProperty()
  avatar?: string;
}
