import { Module } from '@nestjs/common';
import { StudentsStatsService } from './students-stats.service';
import { StudentsStatsController } from './students-stats.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StudentsStatsController],
  providers: [StudentsStatsService],
  exports: [StudentsStatsService],
})
export class StudentsStatsModule {}
