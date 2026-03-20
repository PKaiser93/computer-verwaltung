// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';

// Feature modules
import { AdminStatsModule } from './admin/admin-stats.module';
import { ComputersModule } from './computers/computers.module';
import { ComputerStatsModule } from './computers/computer-stats.module';
import { EmployeesModule } from './employees/employees.module';
import { EmployeesStatsModule } from './employees/employees-stats.module';
import { RequestsModule } from './requests/requests.module';
import { RoomsModule } from './rooms/rooms.module';
import { RoomsStatsModule } from './rooms/rooms-stats.module';
import { StudentsModule } from './students/students.module';
import { StudentsStatsModule } from './students/students-stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,

    // domain & stats
    AdminStatsModule,
    ComputersModule,
    ComputerStatsModule,
    EmployeesModule,
    EmployeesStatsModule,
    RequestsModule,
    RoomsModule,
    RoomsStatsModule,
    StudentsModule,
    StudentsStatsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
