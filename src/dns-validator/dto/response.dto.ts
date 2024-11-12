import { ResponseDto } from 'src/common/response.dto';

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
