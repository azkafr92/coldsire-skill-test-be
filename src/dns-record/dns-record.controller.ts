import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  Inject,
  Query,
  Req,
  Res,
  Version,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DnsRecordService } from './dns-record.service';
import { GetAllRequestDto } from './dto/request.dto';
import { GetAllResponseDto } from './dto/response.dto';

@Controller('dns-record')
export class DnsRecordController {
  constructor(
    private readonly dnsRecordService: DnsRecordService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Version('1')
  @Get()
  async getAll(
    @Query() dto: GetAllRequestDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const key = req.url;
    let resp = await this.cacheManager.get<GetAllResponseDto>(key);
    if (!resp) {
      resp = await this.dnsRecordService.getAll(dto);
      this.cacheManager.set(key, resp);
    }
    res.status(resp.statusCode).json(resp);
  }
}
