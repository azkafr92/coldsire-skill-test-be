import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class Supabase {
  constructor(private readonly configService: ConfigService) {}

  private readonly logger = new Logger(Supabase.name);
  private clientInstance: SupabaseClient;

  getClient() {
    this.logger.debug('Get Supabase client');
    if (this.clientInstance) {
      this.logger.debug('Returning existing client');
      return this.clientInstance;
    } else {
      this.logger.debug('Initializing new client');
      this.clientInstance = createClient(
        this.configService.get('SUPABASE_URL'),
        this.configService.get('SUPABASE_KEY'),
      );
      return this.clientInstance;
    }
  }
}
