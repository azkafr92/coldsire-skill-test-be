import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DnsLookupModule } from './dns-record/dns-record.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [DnsLookupModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
