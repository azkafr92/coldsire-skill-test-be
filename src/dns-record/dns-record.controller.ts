import { Controller, Get, Query, Res, Version } from '@nestjs/common';
import { Response } from 'express';
import { DnsRecordService } from './dns-record.service';
import { GetAllRequestDto } from './dto/request.dto';

@Controller('dns-record')
export class DnsRecordController {
  constructor(private readonly dnsRecordService: DnsRecordService) {}

  @Version('1')
  @Get()
  async getAll(@Query() dto: GetAllRequestDto, @Res() res: Response) {
    console.debug(dto);
    const resp = await this.dnsRecordService.getAll(dto);
    res.status(resp.statusCode).json(resp);
  }
}
