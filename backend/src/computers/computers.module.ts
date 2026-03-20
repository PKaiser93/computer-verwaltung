// backend/src/computers/computers.module.ts
import { Module } from '@nestjs/common';
import { ComputersService } from './computers.service';
import { ComputersController } from './computers.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [PrismaModule, CommonModule],
  controllers: [ComputersController],
  providers: [ComputersService],
  exports: [ComputersService],
})
export class ComputersModule {}
