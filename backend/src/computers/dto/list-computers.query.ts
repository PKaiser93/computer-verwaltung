import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ListComputersQuery {
    @IsInt()
    @Min(1)
    @Type(() => Number)
    @IsOptional()
    page?: number = 1;

    @IsInt()
    @Min(1)
    @Type(() => Number)
    @IsOptional()
    limit?: number = 20;

    @IsEnum(['active', 'inactive', 'maintenance'])
    @IsOptional()
    status?: 'active' | 'inactive' | 'maintenance';

    @IsString()
    @IsOptional()
    roomId?: string;

    @IsString()
    @IsOptional()
    employeeId?: string;

    @IsString()
    @IsOptional()
    studentId?: string;
}
