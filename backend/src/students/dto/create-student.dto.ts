import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
    @IsString()
    name: string;

    @IsEmail()
    @IsOptional()
    email?: string | null;

    @IsBoolean()
    @IsOptional()
    pool?: boolean;
}
