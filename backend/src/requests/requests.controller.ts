import {Controller, Get, Post, Body, Param, Patch} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateWorkstationRequestDto } from './dto/create-workstation-request.dto';
import {UpdateRequestStatusDto} from "./dto/update-request-status.dto";
import {WorkstationRequestDto} from "./dto/workstation-request.dto";

@Controller('workstation-requests')
export class RequestsController {
    constructor(private readonly requestsService: RequestsService) {}

    // Öffentliche Route (kann später z.B. via API-Key/Rate-Limit geschützt werden)
    @Post()
    create(@Body() dto: CreateWorkstationRequestDto) {
        return this.requestsService.create(dto);
    }

    // Admin-Routen
    @Get()
    async findAll(): Promise<WorkstationRequestDto[]> {
        const entities = await this.requestsService.findAll();
        return entities.map((e) => new WorkstationRequestDto(e));
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.requestsService.findOne(id);
    }

    // Admin: Status setzen (allgemein)
    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body() dto: UpdateRequestStatusDto) {
        return this.requestsService.updateStatus(id, dto.status, dto.adminNote);
    }

    // Komfort-Shortcuts: approve / reject
    @Patch(':id/approve')
    approve(@Param('id') id: string, @Body() dto: { adminNote?: string }) {
        return this.requestsService.approve(id, dto.adminNote);
    }

    @Patch(':id/reject')
    reject(@Param('id') id: string, @Body() dto: { adminNote?: string }) {
        return this.requestsService.reject(id, dto.adminNote);
    }
}
