import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { Services } from 'src/utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from 'src/entities/report.entity';
import { JwtModule } from '@nestjs/jwt';
import { KeyToken } from 'src/entities/keytoken.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report, KeyToken]), JwtModule],
  controllers: [ReportController],
  providers: [
    {
      useClass: ReportService,
      provide: Services.REPORT,
    },
  ],
})
export class ReportModule {}
