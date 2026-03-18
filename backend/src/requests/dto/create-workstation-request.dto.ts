import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StudentInfoDto } from './student-info.dto';

export enum WorkTypeDto {
    BACHELOR = 'BACHELOR',
    MASTER = 'MASTER',
    FORSCHUNGSPRAKTIKUM = 'FORSCHUNGSPRAKTIKUM',
}

export enum RequestedComputerTypeDto {
    POOL = 'POOL',
    PERSONALIZED = 'PERSONALIZED',
}

export enum RequestedOsDto {
    WINDOWS = 'WINDOWS',
    LINUX = 'LINUX',
}

export class CreateWorkstationRequestDto {
    @IsString()
    @IsNotEmpty()
    mitarbeiterId: string; // Antragsteller (Mitarbeiter)

    @IsString()
    @IsNotEmpty()
    workTopic: string; // Arbeitsthema

    @IsEnum(WorkTypeDto)
    workType: WorkTypeDto;

    @ValidateNested()
    @Type(() => StudentInfoDto)
    student: StudentInfoDto;

    @IsEnum(RequestedComputerTypeDto)
    requestedComputerType: RequestedComputerTypeDto;

    @IsEnum(RequestedOsDto)
    @IsOptional()
    requestedOs?: RequestedOsDto; // Pflicht nur wenn PERSONALIZED
}
