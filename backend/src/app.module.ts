import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { ComputersModule } from './computers/computers.module';
import { RoomsModule } from './rooms/rooms.module';
import { EmployeesModule } from './employees/employees.module';
import { StudentsModule } from './students/students.module';
import { RequestsModule } from './requests/requests.module';
import { AdminStatsModule } from './admin/admin-stats.module';
import { ComputerStatsModule } from './computers/computer-stats.module';
import { EmployeesStatsModule } from './employees/employees-stats.module';
import { StudentsStatsModule } from './students/students-stats.module';
import { RoomsStatsModule } from './rooms/rooms-stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ComputersModule,
    RoomsModule,
    EmployeesModule,
    StudentsModule,
    RequestsModule,
    AdminStatsModule,
    ComputerStatsModule,
    EmployeesStatsModule,
    StudentsStatsModule,
    RoomsStatsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
