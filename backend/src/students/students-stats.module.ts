// src/students/students-stats.module.ts
import { Module } from '@nestjs/common';
import { StudentsStatsService } from './students-stats.service';
import { StudentsStatsController } from './students-stats.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [StudentsStatsController],
  providers: [StudentsStatsService, PrismaService],
})
export class StudentsStatsModule {}
