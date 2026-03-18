// src/employees/employees-stats.controller.ts
import { Controller, Get } from '@nestjs/common';
import { EmployeesStatsService } from './employees-stats.service';

@Controller('stats/employees')
export class EmployeesStatsController {
  constructor(private readonly statsService: EmployeesStatsService) {}

  @Get()
  getStats() {
    return this.statsService.getEmployeeStats();
  }

  @Get('without-computers')
  getWithoutComputers() {
    return this.statsService.getEmployeesWithoutComputers();
  }
}
