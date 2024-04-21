import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from 'src/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshToken } from './dto/refresh-token.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Shop } from 'src/entities/shop.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: 201, description: 'Register successfully.' })
  @ApiResponse({ status: 401, description: 'Register failed!' })
  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    return this.authService.registerUser(registerUserDto);
  }

  @ApiResponse({ status: 201, description: 'Login successfully.' })
  @ApiResponse({ status: 401, description: 'Login failed!' })
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto): Promise<any> {
    return this.authService.loginUser(loginUserDto);
  }

  @ApiResponse({ status: 201, description: 'Get new token successfully.' })
  @ApiResponse({ status: 401, description: 'Get new token failed!' })
  @Post('refresh-token')
  async handleRefreshToken(@Body() refreshToken: RefreshToken) {
    return await this.authService.handleRefreshToken(refreshToken);
  }

  @ApiResponse({ status: 201, description: 'Register successfully.' })
  @ApiResponse({ status: 401, description: 'Register failed!' })
  @Post('shop/register')
  registerShop(@Body() registerUserDto: RegisterUserDto): Promise<Shop> {
    return this.authService.registerShop(registerUserDto);
  }

  @ApiResponse({ status: 201, description: 'Login successfully.' })
  @ApiResponse({ status: 401, description: 'Login failed!' })
  @Post('shop/login')
  loginShop(@Body() loginUserDto: LoginUserDto): Promise<any> {
    return this.authService.loginShop(loginUserDto);
  }

  @ApiResponse({ status: 201, description: 'Get new token successfully.' })
  @ApiResponse({ status: 401, description: 'Get new token failed!' })
  @Post('shop/refresh-token')
  handleRefreshTokenShop(@Body() refreshToken: RefreshToken) {
    return this.authService.handleRefreshTokenShop(refreshToken);
  }
}
