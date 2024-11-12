import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<unknown> | Promise<Observable<unknown>> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest<Request>();
    const reqId = Date.now();
    this.logger.log(
      JSON.stringify({
        reqId,
        ip: req.ip,
        url: req.url,
        method: req.method,
        body: req.body,
        params: req.params,
        query: req.query,
        headers: req.headers,
      }),
    );
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof HttpException) {
          this.logger.error(
            JSON.stringify({
              reqId,
              name: err.name,
              resp: err.getResponse(),
              statusCode: err.getStatus(),
              message: err.message,
            }),
          );
        }
        return throwError(() => err);
      }),
    );
  }
}
