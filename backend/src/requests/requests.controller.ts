import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateWorkstationRequestDto } from './dto/create-workstation-request.dto';
import { UpdateRequestStatusDto } from './dto/update-request-status.dto';
import { WorkstationRequestDto } from './dto/workstation-request.dto';
import { IdParamDto } from '../common/dto/id-param.dto';

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
    return entities.map((entity) => new WorkstationRequestDto(entity));
  }

  @Get(':id')
  findOne(@Param() params: IdParamDto) {
    return this.requestsService.findOne(params.id);
  }

  // Admin: Status setzen (allgemein)
  @Patch(':id/status')
  updateStatus(
    @Param() params: IdParamDto,
    @Body() dto: UpdateRequestStatusDto,
  ) {
    return this.requestsService.updateStatus(
      params.id,
      dto.status,
      dto.adminNote,
    );
  }

  // Komfort-Shortcuts: approve / reject
  @Patch(':id/approve')
  approve(@Param() params: IdParamDto, @Body() dto: { adminNote?: string }) {
    return this.requestsService.approve(params.id, dto.adminNote);
  }

  @Patch(':id/reject')
  reject(@Param() params: IdParamDto, @Body() dto: { adminNote?: string }) {
    return this.requestsService.reject(params.id, dto.adminNote);
  }
}
