import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        // 1. PostgreSQL Connection Pool
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        });

        // 2. Prisma-Adapter
        const adapter = new PrismaPg(pool);

        // 3. PrismaClient mit Adapter initialisieren
        super({
            adapter,
            log: ['query', 'info', 'warn', 'error'],
        });
    }

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Prisma connected to database via adapter');
    }

    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('Prisma disconnected');
    }
}
