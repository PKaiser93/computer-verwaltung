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
import { IdParamDto } from '../common/dto/id-param.dto';

@Controller('computers')
export class ComputersController {
  constructor(private readonly computersService: ComputersService) {}

  @Get()
  findAll(@Query() query: ListComputersQuery) {
    return this.computersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param() params: IdParamDto) {
    return this.computersService.findOne(params.id);
  }

  @Post()
  create(@Body() dto: CreateComputerDto) {
    return this.computersService.create(dto);
  }

  @Patch(':id')
  update(@Param() params: IdParamDto, @Body() dto: UpdateComputerDto) {
    return this.computersService.update(params.id, dto);
  }

  @Delete(':id')
  remove(@Param() params: IdParamDto) {
    return this.computersService.remove(params.id);
  }

  @Patch(':id/student')
  assignStudent(@Param() params: IdParamDto, @Body() dto: AssignStudentDto) {
    return this.computersService.assignStudent(
      params.id,
      dto.studentId ?? null,
    );
  }

  @Patch(':id/employee')
  assignEmployee(@Param() params: IdParamDto, @Body() dto: AssignEmployeeDto) {
    return this.computersService.assignEmployee(
      params.id,
      dto.employeeId ?? null,
    );
  }
}
