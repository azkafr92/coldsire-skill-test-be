import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseDto } from './common/response.dto';

@Injectable()
export class AppService {
  ping(): ResponseDto<void> {
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    };
  }
}
