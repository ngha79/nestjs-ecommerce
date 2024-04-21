import { ApiProperty } from '@nestjs/swagger';

export class UpdateUser {
  @ApiProperty({ description: 'User Name' })
  userName?: string;

  @ApiProperty({ description: 'Phone number' })
  phoneNumber?: string;

  @ApiProperty({ description: 'Avatar' })
  avatar?: string;

  @ApiProperty({ description: 'Background image' })
  background?: string;
}
