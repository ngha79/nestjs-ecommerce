import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshToken {
  @IsString()
  @ApiProperty()
  refreshToken: string;
}
