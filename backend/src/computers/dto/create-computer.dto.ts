// src/computers/dto/create-computer.dto.ts
import { IsIn, IsOptional, IsString } from 'class-validator';

const COMPUTER_TYPES = ['computer', 'printer', 'device'] as const;
const COMPUTER_STATUS = ['active', 'inactive', 'maintenance'] as const;

export type ComputerTypeDto = (typeof COMPUTER_TYPES)[number];
export type ComputerStatusDto = (typeof COMPUTER_STATUS)[number];

export class CreateComputerDto {
  @IsString()
  name: string;

  @IsString()
  @IsIn(COMPUTER_TYPES)
  type: ComputerTypeDto;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsString()
  @IsIn(COMPUTER_STATUS)
  status: ComputerStatusDto;

  @IsOptional()
  @IsString()
  raumId?: string;

  @IsOptional()
  @IsString()
  mitarbeiterId?: string;

  @IsOptional()
  @IsString()
  studentId?: string;
}
