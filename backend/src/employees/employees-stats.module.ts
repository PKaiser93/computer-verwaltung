import { Module } from '@nestjs/common';
import { EmployeesStatsService } from './employees-stats.service';
import { EmployeesStatsController } from './employees-stats.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EmployeesStatsController],
  providers: [EmployeesStatsService],
  exports: [EmployeesStatsService],
})
export class EmployeesStatsModule {}
