import { IsOptional, IsString, IsUrl } from 'class-validator';
import { RequestDto } from 'src/common/request.dto';

export class GetByDomainNameDto {
  @IsUrl()
  domainName: string;
}

export class GetAllRequestDto extends RequestDto {
  @IsOptional()
  @IsString()
  name?: string;
}
