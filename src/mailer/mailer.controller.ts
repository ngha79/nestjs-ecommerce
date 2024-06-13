import { Controller, Post, Body, Inject } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SendMailDto } from './dto/send-mail.dto';
import { Services } from 'src/utils/constants';

@Controller('mailer')
export class MailerController {
  constructor(
    @Inject(Services.MAILER) private readonly mailerService: MailerService,
  ) {}

  @Post()
  async sendMail(@Body() dto: SendMailDto) {
    return this.mailerService.sendMail(dto);
  }
}
