// backend/src/common/dto/id-param.dto.ts
import { Type } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class IdParamDto {
  @Type(() => String)
  @IsString()
  @Length(1, 100)
  id: string;
}
