import { Module } from '@nestjs/common';
import { DnsRecordController } from './dns-record.controller';
import { DnsRecordService } from './dns-record.service';
import { DnsRecordSchedule } from './dns-record.schedule';

@Module({
  controllers: [DnsRecordController],
  providers: [DnsRecordService, DnsRecordSchedule],
})
export class DnsLookupModule {}
