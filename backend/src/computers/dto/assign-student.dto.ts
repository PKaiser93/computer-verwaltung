import { IsOptional, IsString } from 'class-validator';

export class AssignStudentDto {
    @IsString()
    @IsOptional()
    studentId: string | null;
}
