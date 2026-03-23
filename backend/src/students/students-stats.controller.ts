import { Controller, Get } from '@nestjs/common';
import { StudentsStatsService } from './students-stats.service';

@Controller('students/stats')
export class StudentsStatsController {
  constructor(private readonly studentsStatsService: StudentsStatsService) {}

  @Get('overview')
  getOverview() {
    return this.studentsStatsService.getOverview();
  }

  @Get('without-computer')
  getWithoutComputer() {
    return this.studentsStatsService.getStudentsWithoutComputer();
  }
}
