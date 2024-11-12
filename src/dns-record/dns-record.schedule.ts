import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { TimeIntervalInMs } from 'src/common/const';
import { DnsRecordService } from './dns-record.service';

@Injectable()
export class DnsRecordSchedule {
  constructor(private readonly dnsRecordService: DnsRecordService) {}

  private readonly logger = new Logger(DnsRecordSchedule.name);
  private isCheckDnsRecordFinished = true;

  private readonly domainNameList = [
    'getempoweredoutreachpros.com',
    'altshere.com',
    'internetmarketeersweb.com',
    'trypresspulseai.com',
    'realtaxheroes.com',
    'atmapartner.com',
    'getprohousekeepers.com',
    'swiftygrowth360.com',
    '247taxheroes.co.uk',
    'seoguruatlantanet.com',
  ];

  @Interval(TimeIntervalInMs.TEN_SECONDS)
  checkDnsRecord() {
    if (this.isCheckDnsRecordFinished) {
      this.isCheckDnsRecordFinished = false;

      for (let i = 0; i < this.domainNameList.length; i++) {
        this.dnsRecordService
          .getFullRecord(this.domainNameList[i])
          .then((resp) => {
            this.logger.debug(JSON.stringify(resp));
          });
      }

      this.isCheckDnsRecordFinished = true;
    }
  }
}
