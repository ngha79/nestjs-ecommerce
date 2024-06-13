import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { SendMailDto } from './dto/send-mail.dto';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class MailerService {
  constructor(private readonly configService: ConfigService) {}

  mailTranport() {
    const tranporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
      tls: {
        ciphers: 'SSLv3',
      },
    });

    return tranporter;
  }

  async sendMail(dto: SendMailDto) {
    const { from, html, recipients, subject } = dto;

    const transport = this.mailTranport();
    const options: Mail.Options = {
      from: from ?? {
        name: this.configService.get('MAIL_USER'),
        address: this.configService.get('DEFAULT_MAIL_FROM'),
      },
      to: recipients,
      subject,
      html,
    };
    try {
      const result = await transport.sendMail(options);
      return result;
    } catch (error) {
      console.log('Error:  ', error);
    }
  }
}
