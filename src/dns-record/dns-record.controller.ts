import { Controller, Get, Query, Res, Version } from '@nestjs/common';
import { Response } from 'express';
import { DnsRecordService } from './dns-record.service';
import { GetByDomainNameDto } from './dto/request.dto';

@Controller('dns-record')
export class DnsRecordController {
  constructor(private readonly dnsRecordService: DnsRecordService) {}

  @Version('1')
  @Get()
  async find(@Query() dto: GetByDomainNameDto, @Res() res: Response) {
    const resp = await this.dnsRecordService.getFullRecord(dto.domainName);
    res.status(resp.statusCode).json(resp);
  }
}
