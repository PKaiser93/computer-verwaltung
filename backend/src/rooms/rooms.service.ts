// Variante mit IdGeneratorService (empfohlen)
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { IdGeneratorService } from '../common/id-generator.service';

@Injectable()
export class RoomsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly idGenerator: IdGeneratorService,
  ) {}

  findAll() {
    return this.prisma.raum.findMany({
      include: { computers: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const room = await this.prisma.raum.findUnique({
      where: { id },
      include: { computers: true },
    });
    if (!room) {
      throw new NotFoundException(`Raum ${id} not found`);
    }
    return room;
  }

  async create(data: CreateRoomDto) {
    const id = await this.idGenerator.generateUniqueIdForRoom();

    return this.prisma.raum.create({
      data: {
        id,
        name: data.name.trim(),
      },
    });
  }

  async update(id: string, data: UpdateRoomDto) {
    await this.findOne(id);
    return this.prisma.raum.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.raum.delete({
      where: { id },
    });
  }
}
