// backend/src/students/students.controller.ts
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
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { IdParamDto } from '../common/dto/id-param.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.studentsService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param() params: IdParamDto) {
    return this.studentsService.findOne(params.id);
  }

  @Post()
  create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto);
  }

  @Patch(':id')
  update(@Param() params: IdParamDto, @Body() dto: UpdateStudentDto) {
    return this.studentsService.update(params.id, dto);
  }

  @Delete(':id')
  remove(@Param() params: IdParamDto) {
    return this.studentsService.remove(params.id);
  }
}
