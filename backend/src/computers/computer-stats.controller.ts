// src/computers/computer-stats.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ComputerStatsService } from './computer-stats.service';

@Controller('stats/computers')
export class ComputerStatsController {
  constructor(private readonly statsService: ComputerStatsService) {}

  @Get()
  getStats() {
    return this.statsService.getComputerStats();
  }

  @Get('without-room')
  getWithoutRoom() {
    return this.statsService.getComputersWithoutRoom();
  }

  @Get('without-assignment')
  getWithoutAssignment() {
    return this.statsService.getComputersWithoutAssignment();
  }

  @Get('maintenance')
  getMaintenance() {
    return this.statsService.getMaintenanceComputers();
  }
}
