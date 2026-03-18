// src/rooms/rooms-stats.controller.ts
import { Controller, Get } from '@nestjs/common';
import { RoomsStatsService } from './rooms-stats.service';

@Controller('stats/rooms')
export class RoomsStatsController {
  constructor(private readonly statsService: RoomsStatsService) {}

  @Get()
  getStats() {
    return this.statsService.getRoomStats();
  }

  @Get('with-count')
  getRoomsWithCount() {
    return this.statsService.getRoomsWithCount();
  }
}
