// src/common/id-generator.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { random5Digits } from './id.utils';

@Injectable()
export class IdGeneratorService {
  constructor(private readonly prisma: PrismaService) {}

  async generateComputerId(): Promise<string> {
    return this.generateUniqueId('LRT-C', async (id) => {
      const exists = await this.prisma.computer.findUnique({ where: { id } });
      return !!exists;
    });
  }

  async generateEmployeeId(): Promise<string> {
    return this.generateUniqueId('LRT-M', async (id) => {
      const exists = await this.prisma.mitarbeiter.findUnique({
        where: { id },
      });
      return !!exists;
    });
  }

  async generateStudentId(): Promise<string> {
    return this.generateUniqueId('LRT-S', async (id) => {
      const exists = await this.prisma.student.findUnique({ where: { id } });
      return !!exists;
    });
  }

  async generateRequestId(): Promise<string> {
    return this.generateUniqueId('LRT-A', async (id) => {
      const exists = await this.prisma.workstationRequest.findUnique({
        where: { id },
      });
      return !!exists;
    });
  }

  async generateUniqueIdForRoom(): Promise<string> {
    return this.generateUniqueId('LRT-R', async (id) => {
      const exists = await this.prisma.raum.findUnique({
        where: { id },
      });
      return !!exists;
    });
  }

  private async generateUniqueId(
    prefix: string,
    checkExists: (id: string) => Promise<boolean>,
  ): Promise<string> {
    for (let i = 0; i < 5; i++) {
      const id = `${prefix}-${random5Digits()}`;
      const exists = await checkExists(id);
      if (!exists) return id;
    }
    throw new Error(
      `Konnte keine eindeutige ID für Präfix ${prefix} generieren`,
    );
  }
}
