import { HttpException, HttpStatus } from '@nestjs/common';

export class ShopAlreadyExists extends HttpException {
  constructor() {
    super('Email đã được đăng ký', HttpStatus.CONFLICT);
  }
}
