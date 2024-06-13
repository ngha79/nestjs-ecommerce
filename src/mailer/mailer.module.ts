import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerController } from './mailer.controller';
import { Services } from 'src/utils/constants';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [MailerController],
  providers: [{ provide: Services.MAILER, useClass: MailerService }],
  exports: [{ provide: Services.MAILER, useClass: MailerService }],
})
export class MailerModule {}
