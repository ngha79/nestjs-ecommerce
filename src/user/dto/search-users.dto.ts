import { ApiProperty } from '@nestjs/swagger';

export class SearchUsers {
  @ApiProperty({ description: 'Page' })
  page: string;

  @ApiProperty({ description: 'Limit result per page' })
  limit: string;

  @ApiProperty({ description: 'Search' })
  search?: string;
}
