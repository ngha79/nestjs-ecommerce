import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber } from 'class-validator';

export class PayloadToken {
  @IsNumber()
  @ApiProperty()
  userId: string;

  @ApiProperty()
  @IsEmail()
  email: string;
}
