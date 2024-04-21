import { CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { KeyToken } from 'src/entities/keytoken.entity';
import { Shop } from 'src/entities/shop.entity';
import { StatusShop } from 'src/utils/types';
import { Repository } from 'typeorm';

export class ShopGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(KeyToken)
    private readonly keyTokenRepository: Repository<KeyToken>,
    @InjectRepository(Shop) private shopRepository: Repository<Shop>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get<string>('ACCESSTOKEN_KEY'),
      });
      request.user = payload;
      const shopIsActive = await this.shopRepository.findOne({
        where: {
          id: payload.userId,
          isActive: StatusShop.ACTIVE,
        },
      });
      if (!shopIsActive) {
        throw new HttpException('Shop not found', 419);
      }
    } catch (e) {
      throw new HttpException(e.message, 419);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization
      ? request.headers.authorization.split(' ')
      : [];
    return type === 'Bearer' ? token : undefined;
  }

  private async extractKeyTokenFromHeader(
    userId: string,
  ): Promise<KeyToken | undefined> {
    if (!userId) return undefined;
    const keyToken = await this.keyTokenRepository.findOne({
      where: { userId: userId },
    });
    return keyToken;
  }
}
