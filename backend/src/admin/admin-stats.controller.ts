// src/admin/admin-stats.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AdminStatsService } from './admin-stats.service';

@Controller('stats')
export class AdminStatsController {
  constructor(private readonly adminStatsService: AdminStatsService) {}

  @Get('admin')
  getAdminStats() {
    return this.adminStatsService.getAdminStats();
  }
}
