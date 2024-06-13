import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from 'src/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshToken } from './dto/refresh-token.dto';
import { Shop } from 'src/entities/shop.entity';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    return this.authService.registerUser(registerUserDto);
  }

  @Get('verify/:id')
  verifyUser(@Param('id') id: string): Promise<any> {
    return this.authService.verifyUser(id);
  }

  @Get('verify-shop/:id')
  verifyShop(@Param('id') id: string): Promise<any> {
    return this.authService.verifyShop(id);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto): Promise<any> {
    return this.authService.loginUser(loginUserDto);
  }

  @Post('refresh-token')
  handleRefreshToken(@Body() refreshToken: RefreshToken) {
    return this.authService.handleRefreshToken(refreshToken);
  }

  @Post('shop/register')
  registerShop(@Body() registerUserDto: RegisterUserDto): Promise<Shop> {
    return this.authService.registerShop(registerUserDto);
  }

  @Post('shop/login')
  loginShop(@Body() loginUserDto: LoginUserDto): Promise<any> {
    return this.authService.loginShop(loginUserDto);
  }

  @Post('shop/refresh-token')
  handleRefreshTokenShop(@Body() refreshToken: RefreshToken) {
    return this.authService.handleRefreshTokenShop(refreshToken);
  }

  @Post('forgot-password')
  fotgotPassword(@Body() body: ForgotPasswordDto): Promise<User> {
    return this.authService.fotgotPassword(body.email);
  }
}
