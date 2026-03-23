import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentsStatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview() {
    const [
      totalStudents,
      poolStudents,
      personalStudents,
      studentsWithComputer,
    ] = await Promise.all([
      this.prisma.student.count(),
      this.prisma.student.count({ where: { pool: true } }),
      this.prisma.student.count({ where: { pool: false } }),
      this.prisma.student.count({ where: { computer: { isNot: null } } }),
    ]);

    const studentsWithoutComputer = totalStudents - studentsWithComputer;

    return {
      totalStudents,
      poolStudents,
      personalStudents,
      studentsWithComputer,
      studentsWithoutComputer,
    };
  }

  async getStudentsWithoutComputer() {
    return this.prisma.student.findMany({
      where: { computer: { is: null } },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: { name: 'asc' },
    });
  }
}
