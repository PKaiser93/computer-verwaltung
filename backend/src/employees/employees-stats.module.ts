// src/employees/employees-stats.module.ts
import { Module } from '@nestjs/common';
import { EmployeesStatsService } from './employees-stats.service';
import { EmployeesStatsController } from './employees-stats.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [EmployeesStatsController],
  providers: [EmployeesStatsService, PrismaService],
})
export class EmployeesStatsModule {}
