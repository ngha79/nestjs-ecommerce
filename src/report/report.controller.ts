import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Services } from 'src/utils/constants';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserRequest } from 'src/user/user.decorator';
import { PayloadToken } from 'src/auth/dto/payload-token.dto';
import { DeleteResult } from 'typeorm';
import { QuerySearchReport } from './dto/query-search-report';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('report')
export class ReportController {
  constructor(
    @Inject(Services.REPORT) private readonly reportService: ReportService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('')
  createReport(
    @UserRequest() user: PayloadToken,
    @Body() createReport: CreateReportDto,
  ) {
    return this.reportService.createReport({
      ...createReport,
      userId: user.id,
    });
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteReport(@Param('id') id: string): Promise<DeleteResult> {
    return this.reportService.deleteReport(id);
  }

  @Get()
  @UseGuards(AdminGuard)
  listReport(@Query() searchQuery: QuerySearchReport): Promise<any> {
    return this.reportService.listReport(searchQuery);
  }
}
