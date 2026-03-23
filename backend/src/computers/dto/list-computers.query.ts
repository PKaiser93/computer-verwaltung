// backend/src/computers/dto/list-computers.query.ts
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export enum ComputerStatusFilter {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
}

export class ListComputersQuery extends PaginationDto {
  @IsOptional()
  @IsEnum(ComputerStatusFilter)
  status?: ComputerStatusFilter;

  @IsOptional()
  @IsString()
  roomId?: string;

  @IsOptional()
  @IsString()
  employeeId?: string;

  @IsOptional()
  @IsString()
  studentId?: string;
}
