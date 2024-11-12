import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { lookup, resolveTxt } from 'node:dns';
import { promisify } from 'node:util';
import {
  LookupDto,
  LookupResponseDto,
  ResolveTxtDto,
  ResolveTxtResponseDto,
} from './dto/response.dto';
import { exec } from 'node:child_process';

@Injectable()
export class DnsValidatorService {
  private readonly logger = new Logger(DnsValidatorService.name);

  async dnsLookup(hostname: string): Promise<LookupResponseDto> {
    const pLookup = promisify(lookup);
    const data: LookupDto = {};

    try {
      const resp = await pLookup(hostname);
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

  async getSpfRecord(hostname: string): Promise<ResolveTxtResponseDto> {
    const pResolveTxt = promisify(resolveTxt);
    const data: ResolveTxtDto = {};

    try {
      const records = await pResolveTxt(hostname);
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

  async getDkimRecord(hostname: string): Promise<ResolveTxtResponseDto> {
    const pExec = promisify(exec);

    const _getDkimRecord = async (selector: string, hostname: string) => {
      const value = await pExec(`dig ${selector}._domainkey.${hostname} txt`);
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
      _getDkimRecord('default', hostname),
      _getDkimRecord('google', hostname),
      _getDkimRecord('selector1', hostname),
    ]);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { txt: s1 || s2 || s3 },
    };
  }

  async getDmarcRecord(hostname: string): Promise<ResolveTxtResponseDto> {
    const pResolveTxt = promisify(resolveTxt);
    const data: ResolveTxtDto = {};

    try {
      const records = await pResolveTxt(`_dmarc.${hostname}`);
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
}
