import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Res,
  Version,
} from '@nestjs/common';
import { Response } from 'express';
import { DnsValidatorService } from './dns-validator.service';
import { GetByDomainNameDto as GetByHostnameDto } from './dto/request.dto';

@Controller('dns-validator')
export class DnsValidatorController {
  constructor(private readonly dnsValidatorService: DnsValidatorService) {}

  @Version('1')
  @Get('lookup')
  lookup(@Query() dto: GetByHostnameDto, @Res() res: Response) {
    this.dnsValidatorService.dnsLookup(dto.hostname).then((resp) => {
      res.status(resp.statusCode).json(resp);
    });
  }

  @Version('1')
  @Get('resolve-txt')
  async resolveTxt(@Query() dto: GetByHostnameDto, @Res() res: Response) {
    const [spf, dkim, dmarc] = await Promise.all([
      this.dnsValidatorService.getSpfRecord(dto.hostname).then((resp) => {
        if (resp.data) {
          return resp.data.txt;
        }
        return null;
      }),
      this.dnsValidatorService.getDkimRecord(dto.hostname).then((resp) => {
        if (resp.data) {
          return resp.data.txt;
        }
        return null;
      }),
      this.dnsValidatorService.getDmarcRecord(dto.hostname).then((resp) => {
        if (resp.data) {
          return resp.data.txt;
        }
        return null;
      }),
    ]);

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: {
        spf,
        dkim,
        dmarc,
      },
    });
  }
}
