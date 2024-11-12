import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class RequestDto {
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page: number = 1;

  @IsInt()
  @Type(() => Number)
  @Min(1)
  page_size: number = 10;
}
