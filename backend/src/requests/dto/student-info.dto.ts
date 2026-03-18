import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class StudentInfoDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    idmAccount: string; // z.B. ab12cdef

    @IsEmail()
    @IsNotEmpty()
    email: string; // FAU-Mail
}
