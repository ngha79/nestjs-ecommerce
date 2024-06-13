import { IsEmail, IsString, Length } from 'class-validator';

export class RegisterUserDto {
  @IsEmail({}, { message: 'Email không đúng định dạng.' })
  email: string;

  @IsString({ message: 'Tên không phù hợp.' })
  userName: string;

  @IsString()
  @Length(6, 20, {
    message: 'Mật khẩu phải từ 6 kí tự trở lên hoặc ít hơn 20 kí tự.',
  })
  password: string;

  @IsString()
  @Length(10, 10, { message: 'Số điện thoại không đúng định dạng.' })
  phoneNumber: string;
}
