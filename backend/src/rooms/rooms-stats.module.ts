// src/rooms/rooms-stats.module.ts
import { Module } from '@nestjs/common';
import { RoomsStatsService } from './rooms-stats.service';
import { RoomsStatsController } from './rooms-stats.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [RoomsStatsController],
  providers: [RoomsStatsService, PrismaService],
})
export class RoomsStatsModule {}
