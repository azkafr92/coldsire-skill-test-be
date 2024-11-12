import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DnsLookupModule } from './dns-validator/dns-validator.module';

@Module({
  imports: [DnsLookupModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
