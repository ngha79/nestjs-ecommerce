import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, VerifyUser } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { PayloadToken } from './dto/payload-token.dto';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from './dto/refresh-token.dto';
import { Services } from 'src/utils/constants';
import { CartService } from 'src/cart/cart.service';
import { Shop, VerifyShop } from 'src/entities/shop.entity';
import { MailerService } from 'src/mailer/mailer.service';
import * as crypto from 'crypto';
import { StatusShop } from 'src/utils/types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Shop) private readonly shopRepository: Repository<Shop>,
    @InjectRepository(VerifyShop)
    private readonly shopVerifyRepository: Repository<VerifyShop>,
    @InjectRepository(VerifyUser)
    private readonly userVerifyRepository: Repository<VerifyUser>,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(Services.CARTS)
    private readonly cartService: CartService,
    @Inject(Services.MAILER)
    private readonly mailService: MailerService,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto): Promise<any> {
    const checkEmail = await this.findUserByEmail(registerUserDto.email);
    if (checkEmail) {
      throw new BadRequestException('Email đã được sử dụng!');
    }
    const hashPassword = await this.hashPassword(registerUserDto.password);
    const newUser = await this.userVerifyRepository.save({
      ...registerUserDto,
      password: hashPassword,
    });

    await this.mailService.sendMail({
      html: `<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <style media="all" type="text/css">
              body {
                font-family: Helvetica, sans-serif;
                -webkit-font-smoothing: antialiased;
                font-size: 16px;
                line-height: 1.3;
                -ms-text-size-adjust: 100%;
                -webkit-text-size-adjust: 100%;
              }

              table {
                border-collapse: separate;
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
                width: 100%;
              }

              table td {
                font-family: Helvetica, sans-serif;
                font-size: 16px;
                vertical-align: top;
              }

              html,
              body {
                height: 100%;
              }

              body {
                background-color: #f4f5f6;
                margin: 0;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
              }

              .body {
                background-color: #f4f5f6;
                width: 100%;
              }

              .container {
                margin: 0 auto !important;
                max-width: 600px;
                padding: 0;
                padding-top: 24px;
                width: 600px;
              }

              .content {
                box-sizing: border-box;
                display: block;
                margin: 0 auto;
                max-width: 600px;
                padding: 0;
              }

              .main {
                background: #ffffff;
                border: 1px solid #eaebed;
                border-radius: 16px;
                width: 100%;
              }

              .wrapper {
                box-sizing: border-box;
                padding: 24px;
              }

              .wrapper h1 {
                font-size: 24px;
                font-weight: 700;
                text-align: center;
              }

              .wrapper p {
                word-break: normal;
                font-size: 15px;
              }

              p {
                font-family: Helvetica, sans-serif;
                font-size: 16px;
                font-weight: normal;
                margin: 0;
              }

              a {
                text-decoration: underline;
              }

              .btn {
                box-sizing: border-box;
              }

              .btn {
                padding-bottom: 16px;
              }

              .btn {
                border-radius: 4px;
                text-align: center;
              }

              .btn {
                border: solid 2px #0867ec;
                border-radius: 4px;
                box-sizing: border-box;
                cursor: pointer;
                display: inline-block;
                font-size: 16px;
                font-weight: bold;
                margin: 0;
                padding: 12px 24px;
                text-decoration: none;
                text-transform: capitalize;
              }

              .btn-primary {
                background-color: #0867ec;
                border-color: #0867ec;
                color: #ffffff !important;
              }

              .last {
                margin-bottom: 0;
              }

              .first {
                margin-top: 0;
              }

              .align-center {
                text-align: center;
              }

              .align-right {
                text-align: right;
              }

              .align-left {
                text-align: left;
              }

              .text-link {
                color: #0867ec !important;
                text-decoration: underline !important;
              }

              .clear {
                clear: both;
              }

              .mt0 {
                margin-top: 0;
              }

              .mb0 {
                margin-bottom: 0;
              }

              .pb-4 {
                padding-bottom: 16px;
              }

              .preheader {
                color: transparent;
                display: none;
                height: 0;
                max-height: 0;
                max-width: 0;
                opacity: 0;
                overflow: hidden;
                mso-hide: all;
                visibility: hidden;
                width: 0;
              }

              .powered-by a {
                text-decoration: none;
              }

              .p-8 {
                padding: 32px;
              }

              .text-sm {
                font-size: 15px;
                color: #747474;
              }

              .center {
                display: flex;
                align-content: center;
                gap: 2px;
              }

              .column {
                flex-direction: column;
              }

              .text-center {
                text-align: center;
                font-weight: 600;
              }

              @media only screen and (max-width: 640px) {
                .main p,
                .main td,
                .main span {
                  font-size: 16px !important;
                }
                .wrapper {
                  padding: 8px !important;
                }
                .content {
                  padding: 8px !important;
                }
                .container {
                  padding: 0 !important;
                  padding-top: 8px !important;
                  width: 100% !important;
                }
                .main {
                  border-left-width: 0 !important;
                  border-radius: 0 !important;
                  border-right-width: 0 !important;
                  padding: 8px;
                }
              }
            </style>
          </head>
          <body>
            <table
              role="presentation"
              border="0"
              cellpadding="0"
              cellspacing="0"
              class="body"
            >
              <tr>
                <td>&nbsp;</td>
                <td class="container">
                  <div class="content">
                    <?xml version="1.0" encoding="utf-8"?>
                    <table
                      role="presentation"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      class="main"
                    >
                      <tr>
                        <td class="wrapper">
                          <div class="align-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              xmlns:xlink="http://www.w3.org/1999/xlink"
                              version="1.1"
                              id="distributemail"
                              viewBox="0 0 210.6279 210.0442"
                              enable-background="new 0 0 210.6279 210.0442"
                              xml:space="preserve"
                              width="64"
                              height="64"
                            >
                              <g>
                                <path
                                  fill="#D0E8FF"
                                  d="M80.1001,54.3015L42.4958,20.3357c-1.5867,0.5391-2.7478,1.9902-2.7478,3.7461v73.9346L80.1001,54.3015z"
                                />
                                <path
                                  fill="#D0E8FF"
                                  d="M166.4602,104.0779l-40.9993-44.416l-17.0332,15.3848c-0.7617,0.6875-1.7188,1.0312-2.6797,1.0312   s-1.918-0.3438-2.6797-1.0312L86.0352,59.6619l-40.9993,44.416H166.4602z"
                                />
                                <path
                                  fill="#D0E8FF"
                                  d="M169.0002,20.3357L131.396,54.3015l40.3521,43.7148V24.0818   C171.748,22.3259,170.5869,20.8748,169.0002,20.3357z"
                                />
                                <polygon
                                  fill="#D0E8FF"
                                  points="157.3535,20.0779 54.1426,20.0779 105.748,66.6873  "
                                />
                                <path
                                  fill="#1C71DA"
                                  d="M43.7793,112.0779h123.9375c6.6328,0,12.0312-5.3848,12.0312-12.0039V24.0818   c0-6.5879-5.3501-11.9434-11.9395-11.9941c-0.021-0.001-0.0396-0.0098-0.0605-0.0098h-0.0312H43.7793H43.748   c-0.021,0-0.0396,0.0088-0.0605,0.0098c-6.5894,0.0508-11.9395,5.4062-11.9395,11.9941v75.9922   C31.748,106.6931,37.1465,112.0779,43.7793,112.0779z M103.0684,75.0466c0.7617,0.6875,1.7188,1.0312,2.6797,1.0312   s1.918-0.3438,2.6797-1.0312l17.0332-15.3848l40.9993,44.416H45.0359l40.9993-44.416L103.0684,75.0466z M171.748,98.0164   L131.396,54.3015l37.6042-33.9658c1.5867,0.5391,2.7478,1.9902,2.7478,3.7461V98.0164z M157.3535,20.0779L105.748,66.6873   L54.1426,20.0779H157.3535z M42.4958,20.3357l37.6042,33.9658L39.748,98.0164V24.0818   C39.748,22.3259,40.9092,20.8748,42.4958,20.3357z"
                                />
                                <path
                                  fill="#1C71DA"
                                  d="M185.748,140.0779h-77.313l10.1411-10.1426c1.5625-1.5625,1.5625-4.0938,0-5.6562s-4.0938-1.5625-5.6562,0   l-16.9688,16.9707c-1.5625,1.5625-1.5625,4.0938,0,5.6562l16.9688,16.9707c0.7812,0.7812,1.8047,1.1719,2.8281,1.1719   s2.0469-0.3906,2.8281-1.1719c1.5625-1.5625,1.5625-4.0938,0-5.6562l-10.1411-10.1426h77.313V140.0779z"
                                />
                                <path
                                  fill="#1C71DA"
                                  d="M98.5762,164.2791c-1.5625-1.5625-4.0938-1.5625-5.6562,0s-1.5625,4.0938,0,5.6562l10.1411,10.1426H25.748   v8h77.313l-10.1411,10.1426c-1.5625,1.5625-1.5625,4.0938,0,5.6562c0.7812,0.7812,1.8047,1.1719,2.8281,1.1719   s2.0469-0.3906,2.8281-1.1719l16.9688-16.9707c1.5625-1.5625,1.5625-4.0938,0-5.6562L98.5762,164.2791z"
                                />
                              </g>
                              <path
                                fill="#FF5D5D"
                                d="M178.1426,210.0442c-1.0234,0-2.0479-0.3906-2.8281-1.1714l-14.1426-14.1426  c-1.5625-1.5625-1.5625-4.0947,0-5.6572c1.5605-1.5615,4.0957-1.5615,5.6562,0l14.1426,14.1426  c1.5625,1.5625,1.5625,4.0947,0,5.6572C180.1904,209.6536,179.166,210.0442,178.1426,210.0442z"
                              />
                              <path
                                fill="#FF5D5D"
                                d="M164,210.0417c-1.0234,0-2.0469-0.3906-2.8281-1.1714c-1.5625-1.5625-1.5625-4.0952,0-5.6572  l14.1426-14.1421c1.5605-1.5615,4.0938-1.5615,5.6562,0c1.5625,1.5625,1.5625,4.0952,0,5.6572l-14.1426,14.1421  C166.0479,209.6511,165.0234,210.0417,164,210.0417z"
                              />
                              <path
                                fill="#00D40B"
                                d="M14,163.9021c-7.7197,0-14-6.2803-14-14s6.2803-14,14-14s14,6.2803,14,14S21.7197,163.9021,14,163.9021z   M14,143.9021c-3.3086,0-6,2.6914-6,6s2.6914,6,6,6s6-2.6914,6-6S17.3086,143.9021,14,143.9021z"
                              />
                              <path
                                fill="#FFC504"
                                d="M195.3145,30.6267c-1.0234,0-2.0469-0.3906-2.8281-1.1714l-11.3145-11.3135  c-0.75-0.75-1.1719-1.7676-1.1719-2.8286s0.4219-2.0786,1.1719-2.8286l11.3145-11.3135c1.5625-1.5615,4.0938-1.5615,5.6562,0  l11.3135,11.3135c1.5625,1.5625,1.5625,4.0947,0,5.6572l-11.3135,11.3135C197.3623,30.2361,196.3379,30.6267,195.3145,30.6267z   M189.6572,15.3132l5.6572,5.6567l5.6562-5.6567l-5.6562-5.6567L189.6572,15.3132z"
                              />
                            </svg>
                          </div>
                          <h1>Xác nhận địa chỉ Email</h1>
                          <p class="pb-4">
                            Bạn vừa tạo 1 tài khoản ShopDev mới. Vui lòng xác nhận địa
                            chỉ email của bạn để chúng tôi biết bạn là chủ sở hữu hợp
                            pháp của tài khoản này.
                          </p>
                          <div class="align-center">
                            <a
                              href="http://localhost:3000/verify/${newUser.id}"
                              target="_blank"
                              class="btn-primary btn"
                              >Xác nhận địa chỉ Email của tôi</a
                            >
                          </div>
                        </td>
                      </tr>
                    </table>
                    <div class="p-8 center text-sm column text-center">
                      <p>
                        ShopDev
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-copyright"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M14.83 14.83a4 4 0 1 1 0-5.66" />
                        </svg>
                        2024 ShopDev, Inc. All Rights Reserved.
                      </p>
                      <p>Việt Nam</p>
                    </div>
                  </div>
                </td>
                <td>&nbsp;</td>
              </tr>
            </table>
          </body>
        </html>
        `,
      recipients: [
        {
          name: registerUserDto.userName,
          address: registerUserDto.email,
        },
      ],
      subject: 'Xác minh Email',
    });
    // Create Cart For User
    if (newUser) await this.cartService.create(newUser.id, { cartItems: [] });
    return newUser;
  }

  async verifyUser(id: string) {
    const checkUser = await this.userVerifyRepository.findOne({
      where: { id },
    });
    if (checkUser) {
      const newUser = await this.userRepository.save({ ...checkUser });
      const token = await this.generateToken({
        id: newUser.id,
        email: newUser.email,
        userName: newUser.userName,
        avatar: newUser.avatar,
      });
      const { userName, avatar, background, phoneNumber } = newUser;
      await this.userVerifyRepository.delete({ id });
      return {
        ...token,
        id: newUser.id,
        email: newUser.email,
        userName,
        avatar,
        background,
        phoneNumber,
      };
    }
    throw new NotFoundException('User not found!');
  }

  async verifyShop(id: string) {
    const checkShop = await this.shopVerifyRepository.findOne({
      where: { id },
    });
    if (checkShop) {
      const newShop = await this.shopRepository.save({
        ...checkShop,
        isActive: StatusShop.ACTIVE,
      });
      const token = await this.generateToken({
        id: newShop.id,
        email: newShop.email,
        userName: newShop.userName,
        avatar: newShop.avatar,
      });
      const { userName, avatar, background, phoneNumber } = newShop;
      await this.shopVerifyRepository.delete({ id });
      return {
        ...token,
        id: newShop.id,
        email: newShop.email,
        userName,
        avatar,
        background,
        phoneNumber,
      };
    }
    throw new NotFoundException('Shop not found!');
  }

  async registerShop(registerUserDto: RegisterUserDto): Promise<any> {
    const checkEmail = await this.shopRepository.findOneBy({
      email: registerUserDto.email,
    });
    if (checkEmail) {
      throw new BadRequestException('Email đã được sử dụng!');
    }
    const hashPassword = await this.hashPassword(registerUserDto.password);
    const newUser = await this.shopVerifyRepository.save({
      ...registerUserDto,
      password: hashPassword,
    });
    await this.mailService.sendMail({
      html: `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <style media="all" type="text/css">
      body {
        font-family: Helvetica, sans-serif;
        -webkit-font-smoothing: antialiased;
        font-size: 16px;
        line-height: 1.3;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
      }

      table {
        border-collapse: separate;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        width: 100%;
      }

      table td {
        font-family: Helvetica, sans-serif;
        font-size: 16px;
        vertical-align: top;
      }

      html,
      body {
        height: 100%;
      }

      body {
        background-color: #f4f5f6;
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .body {
        background-color: #f4f5f6;
        width: 100%;
      }

      .container {
        margin: 0 auto !important;
        max-width: 600px;
        padding: 0;
        padding-top: 24px;
        width: 600px;
      }

      .content {
        box-sizing: border-box;
        display: block;
        margin: 0 auto;
        max-width: 600px;
        padding: 0;
      }

      .main {
        background: #ffffff;
        border: 1px solid #eaebed;
        border-radius: 16px;
        width: 100%;
      }

      .wrapper {
        box-sizing: border-box;
        padding: 24px;
      }

      .wrapper h1 {
        font-size: 24px;
        font-weight: 700;
        text-align: center;
      }

      .wrapper p {
        word-break: normal;
        font-size: 15px;
      }

      p {
        font-family: Helvetica, sans-serif;
        font-size: 16px;
        font-weight: normal;
        margin: 0;
      }

      a {
        text-decoration: underline;
      }

      .btn {
        box-sizing: border-box;
      }

      .btn {
        padding-bottom: 16px;
      }

      .btn {
        border-radius: 4px;
        text-align: center;
      }

      .btn {
        border: solid 2px #0867ec;
        border-radius: 4px;
        box-sizing: border-box;
        cursor: pointer;
        display: inline-block;
        font-size: 16px;
        font-weight: bold;
        margin: 0;
        padding: 12px 24px;
        text-decoration: none;
        text-transform: capitalize;
      }

      .btn-primary {
        background-color: #0867ec;
        border-color: #0867ec;
        color: #ffffff !important;
      }

      .last {
        margin-bottom: 0;
      }

      .first {
        margin-top: 0;
      }

      .align-center {
        text-align: center;
      }

      .align-right {
        text-align: right;
      }

      .align-left {
        text-align: left;
      }

      .text-link {
        color: #0867ec !important;
        text-decoration: underline !important;
      }

      .clear {
        clear: both;
      }

      .mt0 {
        margin-top: 0;
      }

      .mb0 {
        margin-bottom: 0;
      }

      .pb-4 {
        padding-bottom: 16px;
      }

      .preheader {
        color: transparent;
        display: none;
        height: 0;
        max-height: 0;
        max-width: 0;
        opacity: 0;
        overflow: hidden;
        mso-hide: all;
        visibility: hidden;
        width: 0;
      }

      .powered-by a {
        text-decoration: none;
      }

      .p-8 {
        padding: 32px;
      }

      .text-sm {
        font-size: 15px;
        color: #747474;
      }

      .center {
        display: flex;
        align-content: center;
        gap: 2px;
      }

      .column {
        flex-direction: column;
      }

      .text-center {
        text-align: center;
        font-weight: 600;
      }

      @media only screen and (max-width: 640px) {
        .main p,
        .main td,
        .main span {
          font-size: 16px !important;
        }
        .wrapper {
          padding: 8px !important;
        }
        .content {
          padding: 8px !important;
        }
        .container {
          padding: 0 !important;
          padding-top: 8px !important;
          width: 100% !important;
        }
        .main {
          border-left-width: 0 !important;
          border-radius: 0 !important;
          border-right-width: 0 !important;
          padding: 8px;
        }
      }
    </style>
  </head>
  <body>
    <table
      role="presentation"
      border="0"
      cellpadding="0"
      cellspacing="0"
      class="body"
    >
      <tr>
        <td>&nbsp;</td>
        <td class="container">
          <div class="content">
            <?xml version="1.0" encoding="utf-8"?>
            <table
              role="presentation"
              border="0"
              cellpadding="0"
              cellspacing="0"
              class="main"
            >
              <tr>
                <td class="wrapper">
                  <div class="align-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      version="1.1"
                      id="distributemail"
                      viewBox="0 0 210.6279 210.0442"
                      enable-background="new 0 0 210.6279 210.0442"
                      xml:space="preserve"
                      width="64"
                      height="64"
                    >
                      <g>
                        <path
                          fill="#D0E8FF"
                          d="M80.1001,54.3015L42.4958,20.3357c-1.5867,0.5391-2.7478,1.9902-2.7478,3.7461v73.9346L80.1001,54.3015z"
                        />
                        <path
                          fill="#D0E8FF"
                          d="M166.4602,104.0779l-40.9993-44.416l-17.0332,15.3848c-0.7617,0.6875-1.7188,1.0312-2.6797,1.0312   s-1.918-0.3438-2.6797-1.0312L86.0352,59.6619l-40.9993,44.416H166.4602z"
                        />
                        <path
                          fill="#D0E8FF"
                          d="M169.0002,20.3357L131.396,54.3015l40.3521,43.7148V24.0818   C171.748,22.3259,170.5869,20.8748,169.0002,20.3357z"
                        />
                        <polygon
                          fill="#D0E8FF"
                          points="157.3535,20.0779 54.1426,20.0779 105.748,66.6873  "
                        />
                        <path
                          fill="#1C71DA"
                          d="M43.7793,112.0779h123.9375c6.6328,0,12.0312-5.3848,12.0312-12.0039V24.0818   c0-6.5879-5.3501-11.9434-11.9395-11.9941c-0.021-0.001-0.0396-0.0098-0.0605-0.0098h-0.0312H43.7793H43.748   c-0.021,0-0.0396,0.0088-0.0605,0.0098c-6.5894,0.0508-11.9395,5.4062-11.9395,11.9941v75.9922   C31.748,106.6931,37.1465,112.0779,43.7793,112.0779z M103.0684,75.0466c0.7617,0.6875,1.7188,1.0312,2.6797,1.0312   s1.918-0.3438,2.6797-1.0312l17.0332-15.3848l40.9993,44.416H45.0359l40.9993-44.416L103.0684,75.0466z M171.748,98.0164   L131.396,54.3015l37.6042-33.9658c1.5867,0.5391,2.7478,1.9902,2.7478,3.7461V98.0164z M157.3535,20.0779L105.748,66.6873   L54.1426,20.0779H157.3535z M42.4958,20.3357l37.6042,33.9658L39.748,98.0164V24.0818   C39.748,22.3259,40.9092,20.8748,42.4958,20.3357z"
                        />
                        <path
                          fill="#1C71DA"
                          d="M185.748,140.0779h-77.313l10.1411-10.1426c1.5625-1.5625,1.5625-4.0938,0-5.6562s-4.0938-1.5625-5.6562,0   l-16.9688,16.9707c-1.5625,1.5625-1.5625,4.0938,0,5.6562l16.9688,16.9707c0.7812,0.7812,1.8047,1.1719,2.8281,1.1719   s2.0469-0.3906,2.8281-1.1719c1.5625-1.5625,1.5625-4.0938,0-5.6562l-10.1411-10.1426h77.313V140.0779z"
                        />
                        <path
                          fill="#1C71DA"
                          d="M98.5762,164.2791c-1.5625-1.5625-4.0938-1.5625-5.6562,0s-1.5625,4.0938,0,5.6562l10.1411,10.1426H25.748   v8h77.313l-10.1411,10.1426c-1.5625,1.5625-1.5625,4.0938,0,5.6562c0.7812,0.7812,1.8047,1.1719,2.8281,1.1719   s2.0469-0.3906,2.8281-1.1719l16.9688-16.9707c1.5625-1.5625,1.5625-4.0938,0-5.6562L98.5762,164.2791z"
                        />
                      </g>
                      <path
                        fill="#FF5D5D"
                        d="M178.1426,210.0442c-1.0234,0-2.0479-0.3906-2.8281-1.1714l-14.1426-14.1426  c-1.5625-1.5625-1.5625-4.0947,0-5.6572c1.5605-1.5615,4.0957-1.5615,5.6562,0l14.1426,14.1426  c1.5625,1.5625,1.5625,4.0947,0,5.6572C180.1904,209.6536,179.166,210.0442,178.1426,210.0442z"
                      />
                      <path
                        fill="#FF5D5D"
                        d="M164,210.0417c-1.0234,0-2.0469-0.3906-2.8281-1.1714c-1.5625-1.5625-1.5625-4.0952,0-5.6572  l14.1426-14.1421c1.5605-1.5615,4.0938-1.5615,5.6562,0c1.5625,1.5625,1.5625,4.0952,0,5.6572l-14.1426,14.1421  C166.0479,209.6511,165.0234,210.0417,164,210.0417z"
                      />
                      <path
                        fill="#00D40B"
                        d="M14,163.9021c-7.7197,0-14-6.2803-14-14s6.2803-14,14-14s14,6.2803,14,14S21.7197,163.9021,14,163.9021z   M14,143.9021c-3.3086,0-6,2.6914-6,6s2.6914,6,6,6s6-2.6914,6-6S17.3086,143.9021,14,143.9021z"
                      />
                      <path
                        fill="#FFC504"
                        d="M195.3145,30.6267c-1.0234,0-2.0469-0.3906-2.8281-1.1714l-11.3145-11.3135  c-0.75-0.75-1.1719-1.7676-1.1719-2.8286s0.4219-2.0786,1.1719-2.8286l11.3145-11.3135c1.5625-1.5615,4.0938-1.5615,5.6562,0  l11.3135,11.3135c1.5625,1.5625,1.5625,4.0947,0,5.6572l-11.3135,11.3135C197.3623,30.2361,196.3379,30.6267,195.3145,30.6267z   M189.6572,15.3132l5.6572,5.6567l5.6562-5.6567l-5.6562-5.6567L189.6572,15.3132z"
                      />
                    </svg>
                  </div>
                  <h1>Xác nhận địa chỉ Email</h1>
                  <p class="pb-4">
                    Bạn vừa tạo 1 tài khoản ShopDev mới. Vui lòng xác nhận địa
                    chỉ email của bạn để chúng tôi biết bạn là chủ sở hữu hợp
                    pháp của tài khoản này.
                  </p>
                  <div class="align-center">
                    <a
                      href="http://localhost:3000/verify/${newUser.id}"
                      target="_blank"
                      class="btn-primary btn"
                      >Xác nhận địa chỉ Email của tôi</a
                    >
                  </div>
                </td>
              </tr>
            </table>
            <div class="p-8 center text-sm column text-center">
              <p>
                ShopDev
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-copyright"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M14.83 14.83a4 4 0 1 1 0-5.66" />
                </svg>
                2024 ShopDev, Inc. All Rights Reserved.
              </p>
              <p>Việt Nam</p>
            </div>
          </div>
        </td>
        <td>&nbsp;</td>
      </tr>
    </table>
  </body>
</html>
`,
      recipients: [
        {
          name: registerUserDto.userName,
          address: registerUserDto.email,
        },
      ],
      subject: 'Xác minh Email',
    });
    return newUser;
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
      id: checkEmail.id,
      email: checkEmail.email,
      userName: checkEmail.userName,
      avatar: checkEmail.avatar,
    });
    const { userName, avatar, background, phoneNumber } = checkEmail;

    return {
      ...token,
      id: checkEmail.id,
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
      id: checkEmail.id,
      email: checkEmail.email,
      userName: checkEmail.userName,
      avatar: checkEmail.avatar,
    });
    const { userName, avatar, background, phoneNumber } = checkEmail;
    return {
      ...token,
      id: checkEmail.id,
      email: checkEmail.email,
      userName,
      avatar,
      background,
      phoneNumber,
    };
  }

  async handleRefreshToken({ refreshToken }: RefreshToken) {
    try {
      const { id, email, userName, avatar } = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.configService.get<string>('REFRESHTOKEN_KEY'),
        },
      );
      const findUser = await this.userRepository.findOne({
        where: { email: email },
      });
      if (!findUser) throw new ForbiddenException('User not registered!');
      const token = await this.generateToken({
        id,
        email,
        userName,
        avatar,
      });

      return {
        user: { id, email },
        tokens: token,
      };
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async handleRefreshTokenShop({ refreshToken }: RefreshToken) {
    try {
      const { id, email, userName, avatar } = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.configService.get<string>('REFRESHTOKEN_KEY'),
        },
      );
      const findUser = await this.shopRepository.findOne({
        where: { email: email },
      });
      if (!findUser) throw new ForbiddenException('User not registered!');
      const token = await this.generateToken({
        id,
        email,
        userName,
        avatar,
      });
      return {
        user: { id, email },
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

  async fotgotPassword(email: string): Promise<any> {
    const checkEmail = await this.findUserByEmail(email);
    if (!checkEmail) {
      throw new NotFoundException('Tài khoản không tồn tại!');
    }
    const newPassword = await crypto.randomBytes(4).toString('hex').slice(0, 8);
    const hashPassword = await this.hashPassword(newPassword);
    await this.userRepository.save({ ...checkEmail, password: hashPassword });
    await this.mailService.sendMail({
      html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <style media="all" type="text/css">
      body {
        font-family: Helvetica, sans-serif;
        -webkit-font-smoothing: antialiased;
        font-size: 16px;
        line-height: 1.3;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
      }

      table {
        border-collapse: separate;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        width: 100%;
      }

      table td {
        font-family: Helvetica, sans-serif;
        font-size: 16px;
        vertical-align: top;
      }

      html,
      body {
        height: 100%;
      }

      body {
        background-color: #f4f5f6;
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .body {
        background-color: #f4f5f6;
        width: 100%;
      }

      .container {
        margin: 0 auto !important;
        max-width: 600px;
        padding: 0;
        padding-top: 24px;
        width: 600px;
      }

      .content {
        box-sizing: border-box;
        display: block;
        margin: 0 auto;
        max-width: 600px;
        padding: 0;
      }

      .main {
        background: #ffffff;
        border: 1px solid #eaebed;
        border-radius: 16px;
        width: 100%;
      }

      .wrapper {
        box-sizing: border-box;
        padding: 24px;
      }

      .wrapper h1 {
        font-size: 24px;
        font-weight: 700;
        text-align: center;
      }

      a {
        text-decoration: underline;
      }

      p {
        margin: 0;
      }

      .btn {
        box-sizing: border-box;
      }

      .btn {
        padding-bottom: 16px;
      }

      .btn {
        border-radius: 4px;
        text-align: center;
      }

      .btn {
        border: solid 2px #0867ec;
        border-radius: 4px;
        box-sizing: border-box;
        cursor: pointer;
        display: inline-block;
        font-size: 16px;
        font-weight: bold;
        margin: 0;
        padding: 12px 24px;
        text-decoration: none;
        text-transform: capitalize;
      }

      .btn-primary {
        background-color: #0867ec;
        border-color: #0867ec;
        color: #ffffff !important;
      }

      .last {
        margin-bottom: 0;
      }

      .first {
        margin-top: 0;
      }

      .align-center {
        text-align: center;
        font-size: 24px;
        font-weight: 700;
      }

      .preheader {
        color: transparent;
        display: none;
        height: 0;
        max-height: 0;
        max-width: 0;
        opacity: 0;
        overflow: hidden;
        mso-hide: all;
        visibility: hidden;
        width: 0;
      }

      .powered-by a {
        text-decoration: none;
      }

      @media only screen and (max-width: 640px) {
        .main p,
        .main td,
        .main span {
          font-size: 16px !important;
        }
        .wrapper {
          padding: 8px !important;
        }
        .content {
          padding: 8px !important;
        }
        .container {
          padding: 0 !important;
          padding-top: 8px !important;
          width: 100% !important;
        }
        .main {
          border-left-width: 0 !important;
          border-radius: 0 !important;
          border-right-width: 0 !important;
          padding: 8px;
        }
      }
    </style>
  </head>
  <body>
    <table
      role="presentation"
      border="0"
      cellpadding="0"
      cellspacing="0"
      class="body"
    >
      <tr>
        <td>&nbsp;</td>
        <td class="container">
          <div class="content">
            <?xml version="1.0" encoding="utf-8"?>
            <table
              role="presentation"
              border="0"
              cellpadding="0"
              cellspacing="0"
              class="main"
            >
              <tr>
                <td class="wrapper">
                  <div class="align-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      version="1.1"
                      id="distributemail"
                      viewBox="0 0 210.6279 210.0442"
                      enable-background="new 0 0 210.6279 210.0442"
                      xml:space="preserve"
                      width="64"
                      height="64"
                    >
                      <g>
                        <path
                          fill="#D0E8FF"
                          d="M80.1001,54.3015L42.4958,20.3357c-1.5867,0.5391-2.7478,1.9902-2.7478,3.7461v73.9346L80.1001,54.3015z"
                        />
                        <path
                          fill="#D0E8FF"
                          d="M166.4602,104.0779l-40.9993-44.416l-17.0332,15.3848c-0.7617,0.6875-1.7188,1.0312-2.6797,1.0312   s-1.918-0.3438-2.6797-1.0312L86.0352,59.6619l-40.9993,44.416H166.4602z"
                        />
                        <path
                          fill="#D0E8FF"
                          d="M169.0002,20.3357L131.396,54.3015l40.3521,43.7148V24.0818   C171.748,22.3259,170.5869,20.8748,169.0002,20.3357z"
                        />
                        <polygon
                          fill="#D0E8FF"
                          points="157.3535,20.0779 54.1426,20.0779 105.748,66.6873  "
                        />
                        <path
                          fill="#1C71DA"
                          d="M43.7793,112.0779h123.9375c6.6328,0,12.0312-5.3848,12.0312-12.0039V24.0818   c0-6.5879-5.3501-11.9434-11.9395-11.9941c-0.021-0.001-0.0396-0.0098-0.0605-0.0098h-0.0312H43.7793H43.748   c-0.021,0-0.0396,0.0088-0.0605,0.0098c-6.5894,0.0508-11.9395,5.4062-11.9395,11.9941v75.9922   C31.748,106.6931,37.1465,112.0779,43.7793,112.0779z M103.0684,75.0466c0.7617,0.6875,1.7188,1.0312,2.6797,1.0312   s1.918-0.3438,2.6797-1.0312l17.0332-15.3848l40.9993,44.416H45.0359l40.9993-44.416L103.0684,75.0466z M171.748,98.0164   L131.396,54.3015l37.6042-33.9658c1.5867,0.5391,2.7478,1.9902,2.7478,3.7461V98.0164z M157.3535,20.0779L105.748,66.6873   L54.1426,20.0779H157.3535z M42.4958,20.3357l37.6042,33.9658L39.748,98.0164V24.0818   C39.748,22.3259,40.9092,20.8748,42.4958,20.3357z"
                        />
                        <path
                          fill="#1C71DA"
                          d="M185.748,140.0779h-77.313l10.1411-10.1426c1.5625-1.5625,1.5625-4.0938,0-5.6562s-4.0938-1.5625-5.6562,0   l-16.9688,16.9707c-1.5625,1.5625-1.5625,4.0938,0,5.6562l16.9688,16.9707c0.7812,0.7812,1.8047,1.1719,2.8281,1.1719   s2.0469-0.3906,2.8281-1.1719c1.5625-1.5625,1.5625-4.0938,0-5.6562l-10.1411-10.1426h77.313V140.0779z"
                        />
                        <path
                          fill="#1C71DA"
                          d="M98.5762,164.2791c-1.5625-1.5625-4.0938-1.5625-5.6562,0s-1.5625,4.0938,0,5.6562l10.1411,10.1426H25.748   v8h77.313l-10.1411,10.1426c-1.5625,1.5625-1.5625,4.0938,0,5.6562c0.7812,0.7812,1.8047,1.1719,2.8281,1.1719   s2.0469-0.3906,2.8281-1.1719l16.9688-16.9707c1.5625-1.5625,1.5625-4.0938,0-5.6562L98.5762,164.2791z"
                        />
                      </g>
                      <path
                        fill="#FF5D5D"
                        d="M178.1426,210.0442c-1.0234,0-2.0479-0.3906-2.8281-1.1714l-14.1426-14.1426  c-1.5625-1.5625-1.5625-4.0947,0-5.6572c1.5605-1.5615,4.0957-1.5615,5.6562,0l14.1426,14.1426  c1.5625,1.5625,1.5625,4.0947,0,5.6572C180.1904,209.6536,179.166,210.0442,178.1426,210.0442z"
                      />
                      <path
                        fill="#FF5D5D"
                        d="M164,210.0417c-1.0234,0-2.0469-0.3906-2.8281-1.1714c-1.5625-1.5625-1.5625-4.0952,0-5.6572  l14.1426-14.1421c1.5605-1.5615,4.0938-1.5615,5.6562,0c1.5625,1.5625,1.5625,4.0952,0,5.6572l-14.1426,14.1421  C166.0479,209.6511,165.0234,210.0417,164,210.0417z"
                      />
                      <path
                        fill="#00D40B"
                        d="M14,163.9021c-7.7197,0-14-6.2803-14-14s6.2803-14,14-14s14,6.2803,14,14S21.7197,163.9021,14,163.9021z   M14,143.9021c-3.3086,0-6,2.6914-6,6s2.6914,6,6,6s6-2.6914,6-6S17.3086,143.9021,14,143.9021z"
                      />
                      <path
                        fill="#FFC504"
                        d="M195.3145,30.6267c-1.0234,0-2.0469-0.3906-2.8281-1.1714l-11.3145-11.3135  c-0.75-0.75-1.1719-1.7676-1.1719-2.8286s0.4219-2.0786,1.1719-2.8286l11.3145-11.3135c1.5625-1.5615,4.0938-1.5615,5.6562,0  l11.3135,11.3135c1.5625,1.5625,1.5625,4.0947,0,5.6572l-11.3135,11.3135C197.3623,30.2361,196.3379,30.6267,195.3145,30.6267z   M189.6572,15.3132l5.6572,5.6567l5.6562-5.6567l-5.6562-5.6567L189.6572,15.3132z"
                      />
                    </svg>
                  </div>
                  <h1>Mật khẩu mới</h1>
                  <p
                    style="
                      text-align: center;
                      font-size: 15px;
                      padding-bottom: 8px;
                    "
                  >
                    Bạn đã xác nhận quên mật khẩu tài khoản. Chúng tôi cung cấp
                    cho bạn một mật khẩu mới, vui lòng đăng nhập bằng mật khẩu
                    mới này và cập nhật mật khẩu mới cho tài khoản của bạn.
                  </p>
                  <div class="align-center">${newPassword}</div>
                  <div
                    style="
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      padding: 16px;
                      flex-direction: column;
                      gap: 2px;
                      color: #747474;
                    "
                  >
                    <p style="font-size: 15px">
                      ShopDev
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-copyright"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M14.83 14.83a4 4 0 1 1 0-5.66" />
                      </svg>
                      2024 ShopDev, Inc. All Rights Reserved.
                    </p>
                    <p style="font-size: 15px">Việt Nam</p>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </td>
        <td>&nbsp;</td>
      </tr>
    </table>
  </body>
</html>

        `,
      recipients: [
        {
          name: checkEmail.userName,
          address: checkEmail.email,
        },
      ],
      subject: 'Quên mật khẩu',
    });
    return true;
  }
}
