import { CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { AdminEcommerce } from 'src/entities/admin.entity';
import { KeyToken } from 'src/entities/keytoken.entity';
import { Repository } from 'typeorm';

export class AdminGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(KeyToken)
    private readonly keyTokenRepository: Repository<KeyToken>,
    private configService: ConfigService,
    @InjectRepository(AdminEcommerce)
    private adminRepo: Repository<AdminEcommerce>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get<string>('ACCESSTOKEN_KEY'),
      });
      request.user = payload;
      const admin = await this.adminRepo.findOne({
        where: {
          id: payload.userId,
        },
      });
      if (!admin) {
        throw new HttpException('Bạn không phải ADMIN.', 419);
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
