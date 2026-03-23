import { Module } from '@nestjs/common';
import { RoomsStatsService } from './rooms-stats.service';
import { RoomsStatsController } from './rooms-stats.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RoomsStatsController],
  providers: [RoomsStatsService],
  exports: [RoomsStatsService],
})
export class RoomsStatsModule {}
