import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum RequestStatusDto {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export class UpdateRequestStatusDto {
    @IsEnum(RequestStatusDto)
    status: RequestStatusDto;

    @IsString()
    @IsOptional()
    adminNote?: string;
}
