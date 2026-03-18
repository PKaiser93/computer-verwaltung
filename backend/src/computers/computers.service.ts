import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComputerDto } from './dto/create-computer.dto';
import { UpdateComputerDto } from './dto/update-computer.dto';
import { ListComputersQuery } from './dto/list-computers.query';
import { StudentAlreadyAssignedError } from '../common/errors/student-already-assigned.error';
import { IdGeneratorService } from '../common/id-generator.service';

@Injectable()
export class ComputersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly idGenerator: IdGeneratorService,
  ) {}

  async findAll(query: ListComputersQuery) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.roomId) {
      where.raumId = query.roomId;
    }

    if (query.employeeId) {
      where.mitarbeiterId = query.employeeId;
    }

    if (query.studentId) {
      where.studentId = query.studentId;
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.computer.findMany({
        where,
        include: { raum: true, mitarbeiter: true, student: true },
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.computer.count({ where }),
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
    const computer = await this.prisma.computer.findUnique({
      where: { id },
      include: {
        raum: true,
        mitarbeiter: true,
        student: true,
      },
    });
    if (!computer) {
      throw new NotFoundException(`Computer ${id} nicht gefunden`);
    }
    return computer;
  }

  async create(dto: CreateComputerDto) {
    const id = await this.idGenerator.generateComputerId();

    if (dto.studentId) {
      const existing = await this.prisma.computer.findFirst({
        where: { studentId: dto.studentId },
      });

      if (existing) {
        throw new BadRequestException(
          `Student ${dto.studentId} ist bereits einem Computer (${existing.name}) zugeordnet`,
        );
      }
    }

    return this.prisma.computer.create({
      data: {
        id,
        name: dto.name,
        type: dto.type,
        ipAddress: dto.ipAddress || null,
        status: dto.status,
        raumId: dto.raumId || null,
        mitarbeiterId: dto.mitarbeiterId || null,
        studentId: dto.studentId || null,
      },
    });
  }

  async update(id: string, dto: UpdateComputerDto) {
    if (dto.studentId) {
      const existing = await this.prisma.computer.findFirst({
        where: { studentId: dto.studentId, NOT: { id } },
      });

      if (existing) {
        throw new StudentAlreadyAssignedError(dto.studentId, existing.name);
      }
    }

    const existingComputer = await this.prisma.computer.findUnique({
      where: { id },
    });

    if (!existingComputer) {
      throw new NotFoundException(`Computer ${id} nicht gefunden`);
    }

    // Optional: Name-Unique prüfen, falls geändert
    if (dto.name && dto.name !== existingComputer.name) {
      const nameTaken = await this.prisma.computer.findUnique({
        where: { name: dto.name },
      });
      if (nameTaken) {
        throw new BadRequestException(
          `Ein Computer mit dem Namen "${dto.name}" existiert bereits`,
        );
      }
    }

    // Student darf nur an einem Computer hängen
    if (dto.studentId) {
      const existingForStudent = await this.prisma.computer.findFirst({
        where: {
          studentId: dto.studentId,
          NOT: { id }, // derselbe Computer ist ok
        },
      });

      if (existingForStudent) {
        throw new BadRequestException(
          `Student ${dto.studentId} ist bereits einem Computer (${existingForStudent.name}) zugeordnet`,
        );
      }
    }

    return this.prisma.computer.update({
      where: { id },
      data: {
        name: dto.name ?? existingComputer.name,
        type: dto.type ?? existingComputer.type,
        ipAddress:
          dto.ipAddress !== undefined
            ? dto.ipAddress || null
            : existingComputer.ipAddress,
        status: dto.status ?? existingComputer.status,
        raumId:
          dto.raumId !== undefined
            ? dto.raumId || null
            : existingComputer.raumId,
        mitarbeiterId:
          dto.mitarbeiterId !== undefined
            ? dto.mitarbeiterId || null
            : existingComputer.mitarbeiterId,
        studentId:
          dto.studentId !== undefined
            ? dto.studentId || null
            : existingComputer.studentId,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.computer.delete({
      where: { id },
    });
  }

  async assignEmployee(computerId: string, employeeId: string | null) {
    const computer = await this.findOne(computerId);

    if (!employeeId) {
      return this.prisma.computer.update({
        where: { id: computer.id },
        data: { mitarbeiterId: null },
      });
    }

    const employee = await this.prisma.mitarbeiter.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new BadRequestException('Mitarbeiter nicht gefunden');
    }

    return this.prisma.computer.update({
      where: { id: computer.id },
      data: { mitarbeiterId: employee.id },
    });
  }

  async assignStudent(computerId: string, studentId: string | null) {
    const computer = await this.findOne(computerId);

    if (!studentId) {
      return this.prisma.computer.update({
        where: { id: computer.id },
        data: { studentId: null },
      });
    }

    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: { computer: true },
    });

    if (!student) {
      throw new BadRequestException('Student not found');
    }

    if (student.pool) {
      throw new BadRequestException(
        'Pool-Studenten dürfen keinen eigenen Computer haben',
      );
    }

    if (student.computer && student.computer.id !== computer.id) {
      throw new BadRequestException(
        'Student hat bereits einen personalisierten Computer',
      );
    }

    if (computer.studentId && computer.studentId !== student.id) {
      throw new BadRequestException(
        'Dieser Computer ist bereits einem anderen Studenten zugeordnet',
      );
    }

    return this.prisma.computer.update({
      where: { id: computer.id },
      data: { studentId: student.id },
    });
  }
}
