// src/computers/computer-stats.module.ts
import { Module } from '@nestjs/common';
import { ComputerStatsService } from './computer-stats.service';
import { ComputerStatsController } from './computer-stats.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ComputerStatsController],
  providers: [ComputerStatsService, PrismaService],
})
export class ComputerStatsModule {}
