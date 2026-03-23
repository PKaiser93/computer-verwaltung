import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmployeesStatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview() {
    const [totalEmployees, employeesWithComputers] = await Promise.all([
      this.prisma.mitarbeiter.count(),
      this.prisma.mitarbeiter.count({
        where: { computers: { some: {} } },
      }),
    ]);

    const employeesWithoutComputers = totalEmployees - employeesWithComputers;

    return {
      totalEmployees,
      employeesWithComputers,
      employeesWithoutComputers,
    };
  }

  async getEmployeesWithoutComputers() {
    return this.prisma.mitarbeiter.findMany({
      where: { computers: { none: {} } },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: { name: 'asc' },
    });
  }
}
