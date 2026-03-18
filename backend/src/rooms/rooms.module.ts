import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CommonModule } from '../common/common.module';
import { RoomsStatsController } from './rooms-stats.controller';
import { RoomsStatsService } from './rooms-stats.service';

@Module({
  imports: [PrismaModule, CommonModule],
  controllers: [RoomsController, RoomsStatsController],
  providers: [RoomsService, RoomsStatsService],
})
export class RoomsModule {}
