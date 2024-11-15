import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { exec } from 'node:child_process';
import { lookup, resolveTxt } from 'node:dns';
import { promisify } from 'node:util';
import { Supabase } from 'src/common/supabase';
import { GetAllRequestDto } from './dto/request.dto';
import {
  GetAllResponseDto,
  LookupDto,
  LookupResponseDto,
  ResolveTxtDto,
  ResolveTxtResponseDto,
} from './dto/response.dto';

@Injectable()
export class DnsRecordService {
  constructor(private readonly supabase: Supabase) {}

  private readonly logger = new Logger(DnsRecordService.name);

  async getAll(dto: GetAllRequestDto): Promise<GetAllResponseDto> {
    const start = (dto.page - 1) * dto.page_size;
    const end = dto.page * dto.page_size - 1;

    const { data, error, count } = await this.supabase
      .getClient()
      .from('dns_record')
      .select('*', { count: 'exact' })
      .ilike('name', `%${dto.name || ''}%`)
      .order('id', { ascending: true })
      .range(start, end);

    if (error) {
      return {
        statusCode: +error.code,
        message: error.message,
      };
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data,
      meta: {
        total_items: count,
        page: dto.page,
        page_size: dto.page_size,
        total_pages: Math.ceil(count / dto.page_size),
      },
    };
  }

  async dnsLookup(domainName: string): Promise<LookupResponseDto> {
    const pLookup = promisify(lookup);
    const data: LookupDto = {};

    try {
      const resp = await pLookup(domainName);
      data.address = resp.address;
      data.family = resp.family;
    } catch (err) {
      this.logger.error(err);
      data.err = err;
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data,
    };
  }

  async getSpfRecord(domainName: string): Promise<ResolveTxtResponseDto> {
    const pResolveTxt = promisify(resolveTxt);
    const data: ResolveTxtDto = {};

    try {
      const records = await pResolveTxt(domainName);
      data.txt =
        records.flat().find((record) => record.startsWith('v=spf1')) || null;
    } catch (err) {
      this.logger.error(err);
      data.txt = null;
      data.err = err;
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data,
    };
  }

  async getDkimRecord(domainName: string): Promise<ResolveTxtResponseDto> {
    const pExec = promisify(exec);

    const _getDkimRecord = async (selector: string, domainName: string) => {
      const value = await pExec(`dig ${selector}._domainkey.${domainName} txt`);
      if (value.stdout.indexOf('v=DKIM1') > -1) {
        return value.stdout
          .substring(
            value.stdout.indexOf('v=DKIM1'),
            value.stdout.indexOf(';; Query time:'),
          )
          .trim();
      }
      return null;
    };

    const [s1, s2, s3] = await Promise.all([
      _getDkimRecord('default', domainName),
      _getDkimRecord('google', domainName),
      _getDkimRecord('selector1', domainName),
    ]);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { txt: s1 || s2 || s3 },
    };
  }

  async getDmarcRecord(domainName: string): Promise<ResolveTxtResponseDto> {
    const pResolveTxt = promisify(resolveTxt);
    const data: ResolveTxtDto = {};

    try {
      const records = await pResolveTxt(`_dmarc.${domainName}`);
      data.txt =
        records.flat().find((record) => record.startsWith('v=DMARC1')) || null;
    } catch (err) {
      this.logger.error(err);
      data.txt = null;
      data.err = err;
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data,
    };
  }

  async getFullRecord(domainName: string) {
    const stringOrNull = (value: ResolveTxtResponseDto): string | null => {
      if (value.data) {
        return value.data.txt;
      }
      return null;
    };

    const [spf, dkim, dmarc] = await Promise.all([
      this.getSpfRecord(domainName).then(stringOrNull),
      this.getDkimRecord(domainName).then(stringOrNull),
      this.getDmarcRecord(domainName).then(stringOrNull),
    ]);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: {
        domainName,
        spf,
        dkim,
        dmarc,
      },
    };
  }
}
