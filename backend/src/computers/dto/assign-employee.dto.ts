import { IsOptional, IsString } from 'class-validator';

export class AssignEmployeeDto {
    @IsString()
    @IsOptional()
    employeeId: string | null;
}
