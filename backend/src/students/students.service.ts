import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { random5Digits } from '../common/id.utils';
import { IdGeneratorService } from '../common/id-generator.service';

@Injectable()
export class StudentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly idGenerator: IdGeneratorService,
  ) {}

  findAll() {
    return this.prisma.student.findMany({
      include: { computer: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: { computer: true },
    });
    if (!student) {
      throw new NotFoundException(`Student ${id} not found`);
    }
    return student;
  }

  async create(dto: CreateStudentDto) {
    const id = await this.idGenerator.generateStudentId();
    return this.prisma.student.create({
      data: {
        id,
        name: dto.name,
        email: dto.email ?? null,
        pool: dto.pool ?? true,
      },
    });
  }

  async update(id: string, data: UpdateStudentDto) {
    const existing = await this.prisma.student.findUnique({
      where: { id },
      include: { computer: true },
    });

    if (!existing) {
      throw new NotFoundException(`Student ${id} not found`);
    }

    if (data.pool === true && existing.computer) {
      throw new BadRequestException(
        'Student hat einen personalisierten Computer und kann nicht als Pool-Student markiert werden',
      );
    }

    return this.prisma.student.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.student.delete({
      where: { id },
    });
  }

  private async generateStudentId(): Promise<string> {
    for (let i = 0; i < 5; i++) {
      const id = `LRT-S-${random5Digits()}`;
      const exists = await this.prisma.student.findUnique({ where: { id } });
      if (!exists) return id;
    }
    throw new Error('Konnte keine eindeutige Studenten-ID generieren');
  }
}
