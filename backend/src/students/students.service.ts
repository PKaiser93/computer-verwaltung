// backend/src/students/students.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { IdGeneratorService } from '../common/id-generator.service';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class StudentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly idGenerator: IdGeneratorService,
  ) {}

  async findAll(pagination: PaginationDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 50;
    const skip = (page - 1) * limit;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.student.findMany({
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.student.count(),
    ]);

    return {
      data: items,
      meta: {
        page,
        limit,
        total,
        pageCount: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: { computer: true },
    });

    if (!student) {
      throw new NotFoundException(`Student ${id} nicht gefunden`);
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

  async update(id: string, dto: UpdateStudentDto) {
    const existing = await this.prisma.student.findUnique({
      where: { id },
      include: { computer: true },
    });

    if (!existing) {
      throw new NotFoundException(`Student ${id} nicht gefunden`);
    }

    if (dto.pool === true && existing.computer) {
      throw new BadRequestException(
        'Student hat einen personalisierten Computer und kann nicht als Pool-Student markiert werden',
      );
    }

    return this.prisma.student.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.student.delete({
      where: { id },
    });
  }
}
