import { Controller, Get } from '@nestjs/common';
import { EmployeesStatsService } from './employees-stats.service';

@Controller('employees/stats')
export class EmployeesStatsController {
  constructor(private readonly employeesStatsService: EmployeesStatsService) {}

  @Get('overview')
  getOverview() {
    return this.employeesStatsService.getOverview();
  }

  @Get('without-computers')
  getWithoutComputers() {
    return this.employeesStatsService.getEmployeesWithoutComputers();
  }
}
