// backend/src/computers/computers.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ComputersService } from './computers.service';
import { CreateComputerDto } from './dto/create-computer.dto';
import { UpdateComputerDto } from './dto/update-computer.dto';
import { AssignStudentDto } from './dto/assign-student.dto';
import { AssignEmployeeDto } from './dto/assign-employee.dto';
import { ListComputersQuery } from './dto/list-computers.query';

@Controller('computers')
export class ComputersController {
  constructor(private readonly computersService: ComputersService) {}

  @Get()
  findAll(@Query() query: ListComputersQuery) {
    return this.computersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.computersService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateComputerDto) {
    return this.computersService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateComputerDto) {
    return this.computersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.computersService.remove(id);
  }

  @Patch(':id/student')
  assignStudent(@Param('id') id: string, @Body() dto: AssignStudentDto) {
    return this.computersService.assignStudent(id, dto.studentId ?? null);
  }

  @Patch(':id/employee')
  assignEmployee(@Param('id') id: string, @Body() dto: AssignEmployeeDto) {
    return this.computersService.assignEmployee(id, dto.employeeId ?? null);
  }
}
