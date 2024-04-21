import { DeleteResult } from 'typeorm';
import { CreateReportDto } from '../dto/create-report';
import { QuerySearchReport } from '../dto/query-search-report';
import { Report } from 'src/entities/report.entity';

export interface IReportService {
  createReport(createReportDto: CreateReportDto): Promise<Report>;
  deleteReport(id: string): Promise<DeleteResult>;
  listReport(querySearch: QuerySearchReport): Promise<any>;
}
