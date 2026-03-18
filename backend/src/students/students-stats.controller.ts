// src/students/students-stats.controller.ts
import { Controller, Get } from '@nestjs/common';
import { StudentsStatsService } from './students-stats.service';

@Controller('stats/students')
export class StudentsStatsController {
  constructor(private readonly statsService: StudentsStatsService) {}

  @Get()
  getStats() {
    return this.statsService.getStudentStats();
  }

  @Get('without-computer')
  getWithoutComputer() {
    return this.statsService.getStudentsWithoutComputer();
  }
}
