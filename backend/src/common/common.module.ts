// src/common/common.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IdGeneratorService } from './id-generator.service';

@Module({
  providers: [PrismaService, IdGeneratorService],
  exports: [IdGeneratorService],
})
export class CommonModule {}
