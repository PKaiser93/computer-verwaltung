import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateWorkstationRequestDto,
  RequestedComputerTypeDto,
} from './dto/create-workstation-request.dto';
import { RequestStatusDto } from './dto/update-request-status.dto';
import { IdGeneratorService } from '../common/id-generator.service';

@Injectable()
export class RequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly idGenerator: IdGeneratorService,
  ) {}

  async create(dto: CreateWorkstationRequestDto) {
    const id = await this.idGenerator.generateRequestId();

    const mitarbeiter = await this.prisma.mitarbeiter.findUnique({
      where: { id: dto.mitarbeiterId },
    });

    if (!mitarbeiter) {
      throw new BadRequestException(
        'Antragsteller (Mitarbeiter) nicht gefunden',
      );
    }

    if (
      dto.requestedComputerType === RequestedComputerTypeDto.PERSONALIZED &&
      !dto.requestedOs
    ) {
      throw new BadRequestException(
        'Bei personalisiertem Rechner muss ein Betriebssystem angegeben werden',
      );
    }

    const { student } = dto;

    return this.prisma.workstationRequest.create({
      data: {
        id,
        mitarbeiterId: dto.mitarbeiterId,
        workTopic: dto.workTopic,
        workType: dto.workType as any,
        studentFirstName: student.firstName,
        studentLastName: student.lastName,
        studentIdm: student.idmAccount,
        studentEmail: student.email,
        requestedComputerType: dto.requestedComputerType as any,
        requestedOs: dto.requestedOs ?? null,
      },
    });
  }

  async updateStatus(
    id: string,
    statusDto: RequestStatusDto,
    adminNote?: string,
  ) {
    const existing = await this.prisma.workstationRequest.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Workstation-Request ${id} nicht gefunden`);
    }

    if (existing.status !== 'PENDING') {
      throw new BadRequestException(
        'Status kann nur aus dem Zustand PENDING geändert werden',
      );
    }

    return this.prisma.workstationRequest.update({
      where: { id },
      data: {
        status: statusDto as any,
        adminNote: adminNote ?? null,
      },
    });
  }

  approve(id: string, adminNote?: string) {
    return this.updateStatus(id, RequestStatusDto.APPROVED, adminNote);
  }

  reject(id: string, adminNote?: string) {
    return this.updateStatus(id, RequestStatusDto.REJECTED, adminNote);
  }

  async findAll() {
    return this.prisma.workstationRequest.findMany({
      include: {
        mitarbeiter: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const request = await this.prisma.workstationRequest.findUnique({
      where: { id },
      include: { mitarbeiter: true },
    });

    if (!request) {
      throw new NotFoundException(`Workstation-Request ${id} nicht gefunden`);
    }

    return request;
  }
}
