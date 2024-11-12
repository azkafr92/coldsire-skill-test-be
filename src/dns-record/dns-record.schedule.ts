import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { TimeIntervalInMs } from 'src/common/const';
import { DnsRecordService } from './dns-record.service';
import { Supabase } from 'src/common/supabase';
import { DnsRecord, UpdateDnsRecord } from './dns-record.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DnsRecordSchedule {
  constructor(
    private readonly dnsRecordService: DnsRecordService,
    private readonly supabase: Supabase,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger = new Logger(DnsRecordSchedule.name);
  private isCheckDnsRecordFinished = true;
  private readonly batchSize = +this.configService.get(
    'DNS_RECORD_SCHEDULE_BATCH_SIZE',
  );
  private readonly tableName = 'dns_record';

  @Interval(TimeIntervalInMs.ONE_MINUTE)
  checkDnsRecord() {
    if (this.isCheckDnsRecordFinished) {
      this.logger.log('Start checking DNS record');
      this.isCheckDnsRecordFinished = false;

      this.supabase
        .getClient()
        .from(this.tableName)
        .select<'id,name', DnsRecord>('id,name')
        .is('deleted_at', null)
        .order('updated_at', { ascending: true })
        .limit(this.batchSize)
        .then((resp) => {
          return Promise.all(
            resp.data.map(async (value) => {
              const resp = await this.dnsRecordService.getFullRecord(
                value.name,
              );
              this.logger.debug(JSON.stringify(resp));
              return resp;
            }),
          );
        })
        .then(async (resp) => {
          for (let i = 0; i < resp.length; i++) {
            const { error } = await this.supabase
              .getClient()
              .from(this.tableName)
              .update<UpdateDnsRecord>({
                spf: resp[i].data.spf,
                dkim: resp[i].data.dkim,
                dmarc: resp[i].data.dmarc,
                updated_at: new Date(),
              })
              .eq('name', resp[i].data.domainName);
            if (error) {
              this.logger.error(error);
            }
          }
        })
        .then(() => {
          this.logger.log('Finish checking DNS Record');
          this.isCheckDnsRecordFinished = true;
        });
    }
  }
}
