import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ping')
  ping(@Res() res: Response) {
    const resp = this.appService.ping();
    res.status(resp.statusCode).json(resp);
  }
}
