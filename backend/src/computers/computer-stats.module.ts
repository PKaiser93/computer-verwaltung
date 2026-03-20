// backend/src/computers/computer-stats.module.ts
import { Module } from '@nestjs/common';
import { ComputerStatsService } from './computer-stats.service';
import { ComputerStatsController } from './computer-stats.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ComputerStatsController],
  providers: [ComputerStatsService],
  exports: [ComputerStatsService],
})
export class ComputerStatsModule {}
