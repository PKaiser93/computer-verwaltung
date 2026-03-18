// src/admin/admin-stats.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminStatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAdminStats() {
    const [totalComputers, pendingRequests, occupiedComputers] =
      await Promise.all([
        this.prisma.computer.count(),
        this.prisma.workstationRequest.count({
          where: { status: 'PENDING' },
        }),
        this.prisma.computer.count({
          where: { studentId: { not: null } },
        }),
      ]);

    return {
      totalComputers,
      pendingRequests,
      occupiedComputers,
    };
  }
}
