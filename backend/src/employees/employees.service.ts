import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { IdGeneratorService } from '../common/id-generator.service';

@Injectable()
export class EmployeesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly idGenerator: IdGeneratorService,
  ) {}

  findAll() {
    return this.prisma.mitarbeiter.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async findOne(id: string) {
    const employee = await this.prisma.mitarbeiter.findUnique({
      where: { id },
      include: { computers: true },
    });
    if (!employee) {
      throw new NotFoundException(`Mitarbeiter ${id} not found`);
    }
    return employee;
  }

  async create(data: CreateEmployeeDto) {
    const id = await this.idGenerator.generateEmployeeId();

    return this.prisma.mitarbeiter.create({
      data: {
        id,
        name: data.name,
        email: data.email,
      },
    });
  }

  async update(id: string, data: UpdateEmployeeDto) {
    await this.findOne(id);
    return this.prisma.mitarbeiter.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.mitarbeiter.delete({
      where: { id },
    });
  }
}
