// backend/src/computers/computer-stats.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ComputerStatsService } from './computer-stats.service';

@Controller('computers/stats')
export class ComputerStatsController {
  constructor(private readonly computerStatsService: ComputerStatsService) {}

  @Get('overview')
  getOverview() {
    return this.computerStatsService.getOverview();
  }

  @Get('without-room')
  getWithoutRoom() {
    return this.computerStatsService.getComputersWithoutRoom();
  }

  @Get('without-assignment')
  getWithoutAssignment() {
    return this.computerStatsService.getComputersWithoutAssignment();
  }

  @Get('maintenance')
  getMaintenance() {
    return this.computerStatsService.getMaintenanceComputers();
  }
}
