import { Module } from '@nestjs/common';
import { DnsRecordController } from './dns-record.controller';
import { DnsRecordService } from './dns-record.service';
import { DnsRecordSchedule } from './dns-record.schedule';
import { Supabase } from 'src/common/supabase';

@Module({
  controllers: [DnsRecordController],
  providers: [DnsRecordService, DnsRecordSchedule, Supabase],
})
export class DnsLookupModule {}
