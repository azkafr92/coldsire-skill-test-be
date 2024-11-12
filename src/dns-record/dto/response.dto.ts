import { ResponseDto } from 'src/common/response.dto';
import { DnsRecord } from '../dns-record.type';

export interface LookupDto {
  err?: NodeJS.ErrnoException;
  address?: string;
  family?: number;
}

export interface LookupResponseDto extends ResponseDto<LookupDto> {}

export interface ResolveTxtDto {
  err?: unknown;
  txt?: string;
}

export interface ResolveTxtResponseDto extends ResponseDto<ResolveTxtDto> {}

export interface GetAllResponseDto extends ResponseDto<DnsRecord[]> {}
