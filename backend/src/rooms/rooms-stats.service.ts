import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoomsStatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview() {
    const [totalRooms, roomsWithComputers] = await Promise.all([
      this.prisma.raum.count(),
      this.prisma.raum.count({
        where: { computers: { some: {} } },
      }),
    ]);

    const roomsWithoutComputers = totalRooms - roomsWithComputers;

    return {
      totalRooms,
      roomsWithComputers,
      roomsWithoutComputers,
    };
  }

  async getRoomsWithCount() {
    const rooms = await this.prisma.raum.findMany({
      include: {
        _count: {
          select: { computers: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return rooms.map((room) => ({
      id: room.id,
      name: room.name,
      computerCount: room._count.computers,
    }));
  }
}
