import { Controller, Get } from '@nestjs/common';
import { AdminStatsService } from './admin-stats.service';

@Controller('admin/stats')
export class AdminStatsController {
  constructor(private readonly adminStatsService: AdminStatsService) {}

  @Get('overview')
  getOverview() {
    return this.adminStatsService.getOverview();
  }
}
