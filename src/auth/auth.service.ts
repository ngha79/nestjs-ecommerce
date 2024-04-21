import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { PayloadToken } from './dto/payload-token.dto';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from './dto/refresh-token.dto';
import { Services } from 'src/utils/constants';
import { CartService } from 'src/cart/cart.service';
import { Shop } from 'src/entities/shop.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Shop) private readonly shopRepository: Repository<Shop>,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(Services.CARTS)
    private readonly cartService: CartService,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto): Promise<User> {
    const checkEmail = await this.findUserByEmail(registerUserDto.email);
    if (checkEmail) {
      throw new BadRequestException('Email đã được sử dụng!');
    }
    const hashPassword = await this.hashPassword(registerUserDto.password);
    const newUser = await this.userRepository.save({
      ...registerUserDto,
      password: hashPassword,
    });
    // Create Cart For User
    if (newUser) await this.cartService.create(newUser.id, { cartItems: [] });
    const { password, ...res } = newUser;
    return res as User;
  }

  async registerShop(registerUserDto: RegisterUserDto): Promise<Shop> {
    const checkEmail = await this.shopRepository.findOneBy({
      email: registerUserDto.email,
    });
    if (checkEmail) {
      throw new BadRequestException('Email đã được sử dụng!');
    }
    const hashPassword = await this.hashPassword(registerUserDto.password);
    const newUser = await this.shopRepository.save({
      ...registerUserDto,
      password: hashPassword,
    });
    const { password, ...res } = newUser;
    return res as Shop;
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<object> {
    const checkEmail = await this.findUserByEmail(loginUserDto.email);
    if (!checkEmail) {
      throw new UnauthorizedException(
        'Tài khoản hoặc mật khẩu không chính xác!',
      );
    }
    const checkPassword = await this.comparePassword(
      loginUserDto.password,
      checkEmail.password,
    );
    if (!checkPassword) {
      throw new UnauthorizedException(
        'Tài khoản hoặc mật khẩu không chính xác!',
      );
    }

    const token = await this.generateToken({
      userId: checkEmail.id,
      email: checkEmail.email,
    });
    const { userName, avatar, background, phoneNumber } = checkEmail;
    return {
      ...token,
      userId: checkEmail.id,
      email: checkEmail.email,
      userName,
      avatar,
      background,
      phoneNumber,
    };
  }

  async loginShop(loginUserDto: LoginUserDto): Promise<object> {
    const checkEmail = await this.shopRepository.findOneBy({
      email: loginUserDto.email,
    });
    if (!checkEmail) {
      throw new UnauthorizedException(
        'Tài khoản hoặc mật khẩu không chính xác!',
      );
    }
    const checkPassword = await this.comparePassword(
      loginUserDto.password,
      checkEmail.password,
    );
    if (!checkPassword) {
      throw new UnauthorizedException(
        'Tài khoản hoặc mật khẩu không chính xác!',
      );
    }
    const token = await this.generateToken({
      userId: checkEmail.id,
      email: checkEmail.email,
    });
    const { userName, avatar, background, phoneNumber } = checkEmail;
    return {
      ...token,
      userId: checkEmail.id,
      email: checkEmail.email,
      userName,
      avatar,
      background,
      phoneNumber,
    };
  }

  async handleRefreshToken({ refreshToken }: RefreshToken) {
    try {
      const { userId, email } = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.configService.get<string>('REFRESHTOKEN_KEY'),
        },
      );
      const findUser = await this.userRepository.findOne({
        where: { email: email },
      });
      if (!findUser) throw new ForbiddenException('User not registered!');
      const token = await this.generateToken({ userId, email });

      return {
        user: { userId, email },
        tokens: token,
      };
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async handleRefreshTokenShop({ refreshToken }: RefreshToken) {
    try {
      const { userId, email } = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.configService.get<string>('REFRESHTOKEN_KEY'),
        },
      );
      const findUser = await this.shopRepository.findOne({
        where: { email: email },
      });
      if (!findUser) throw new ForbiddenException('User not registered!');
      const token = await this.generateToken({ userId, email });
      return {
        user: { userId, email },
        tokens: token,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
  }

  private async comparePassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
  }

  private async findUserByEmail(email: string) {
    return await this.userRepository.findOneBy({ email: email });
  }

  private async generateToken(payload: PayloadToken) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('ACCESSTOKEN_KEY'),
      expiresIn: this.configService.get<string>('EXPIRE_ACCESSTOKEN'),
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('REFRESHTOKEN_KEY'),
      expiresIn: this.configService.get<string>('EXPIRE_REFRESHTOKEN'),
    });

    return { accessToken, refreshToken };
  }
}
