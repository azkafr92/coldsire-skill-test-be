import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { LoggingInterceptor } from './logger/logger.interceptor';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableVersioning({ type: VersioningType.URI });
  app.setGlobalPrefix('api', { exclude: ['ping'] });
  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(configService.get<string>('PORT'), '0.0.0.0');
}
bootstrap();
