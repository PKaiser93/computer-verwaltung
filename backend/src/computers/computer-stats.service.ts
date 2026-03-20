// backend/src/computers/computer-stats.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ComputerStatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview() {
    const [
      totalComputers,
      activeComputers,
      inactiveComputers,
      maintenanceComputers,
      occupiedComputers,
      unassignedComputers,
    ] = await Promise.all([
      this.prisma.computer.count(),
      this.prisma.computer.count({ where: { status: 'active' } }),
      this.prisma.computer.count({ where: { status: 'inactive' } }),
      this.prisma.computer.count({ where: { status: 'maintenance' } }),
      this.prisma.computer.count({
        where: { studentId: { not: null } },
      }),
      this.prisma.computer.count({
        where: {
          studentId: null,
          mitarbeiterId: null,
        },
      }),
    ]);

    return {
      totalComputers,
      activeComputers,
      inactiveComputers,
      maintenanceComputers,
      occupiedComputers,
      unassignedComputers,
    };
  }

  async getComputersWithoutRoom() {
    return this.prisma.computer.findMany({
      where: { raumId: null },
      select: { id: true, name: true, status: true, ipAddress: true },
      orderBy: { name: 'asc' },
    });
  }

  async getComputersWithoutAssignment() {
    return this.prisma.computer.findMany({
      where: { studentId: null, mitarbeiterId: null },
      select: { id: true, name: true, status: true, ipAddress: true },
      orderBy: { name: 'asc' },
    });
  }

  async getMaintenanceComputers() {
    return this.prisma.computer.findMany({
      where: { status: 'maintenance' },
      select: { id: true, name: true, status: true, ipAddress: true },
      orderBy: { name: 'asc' },
    });
  }
}
