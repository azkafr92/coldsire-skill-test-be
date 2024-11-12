import { Module } from '@nestjs/common';
import { DnsValidatorController } from './dns-validator.controller';
import { DnsValidatorService } from './dns-validator.service';

@Module({
  controllers: [DnsValidatorController],
  providers: [DnsValidatorService],
})
export class DnsLookupModule {}
