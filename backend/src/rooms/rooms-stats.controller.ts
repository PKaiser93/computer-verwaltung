import { Controller, Get } from '@nestjs/common';
import { RoomsStatsService } from './rooms-stats.service';

@Controller('rooms/stats')
export class RoomsStatsController {
  constructor(private readonly roomsStatsService: RoomsStatsService) {}

  @Get('overview')
  getOverview() {
    return this.roomsStatsService.getOverview();
  }

  @Get('with-count')
  getRoomsWithCount() {
    return this.roomsStatsService.getRoomsWithCount();
  }
}
