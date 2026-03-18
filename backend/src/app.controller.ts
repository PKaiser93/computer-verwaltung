import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
    constructor(private prisma: PrismaService) {}

    @Get()
    async root() {
        const computers = await this.prisma.computer.findMany({
            take: 5,
            include: { raum: true, mitarbeiter: true },
        });
        return {
            message: 'Computerverwaltung Backend ready!',
            computers,
            count: await this.prisma.computer.count(),
        };
    }
}
