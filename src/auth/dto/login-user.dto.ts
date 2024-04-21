import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator'

export class LoginUserDto {
    @ApiProperty({ description: 'Email:' })
    @IsEmail({}, { message: 'Email không đúng định dạng.' })
    email: string;

    @ApiProperty({ description: 'Password:' })
    @IsString()
    @Length(6, 20, { message: 'Mật khẩu phải từ 6 kí tự trở lên hoặc ít hơn 20 kí tự.' })
    password: string;
}