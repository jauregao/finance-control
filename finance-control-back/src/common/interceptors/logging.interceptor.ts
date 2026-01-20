import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  Logger,
  type NestInterceptor,
} from '@nestjs/common';
import type { Response } from 'express';
import { Observable, tap } from 'rxjs';
import type { AuthenticatedRequest, RequestContext } from '../types';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = this.extractRequestContext(context);

    return next.handle().pipe(
      tap({
        next: () => this.logSuccess(context, ctx),
        error: (error) => this.logError(error, ctx),
      }),
    );
  }

  private extractRequestContext(context: ExecutionContext): RequestContext {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();

    return {
      method: req.method,
      url: req.url,
      ip: req.ip ?? 'unknown',
      userAgent: req.get('user-agent') ?? '',
      userId: req.user?.userId ?? 'anonymous',
      startTime: Date.now(),
    };
  }

  private logSuccess(context: ExecutionContext, ctx: RequestContext): void {
    const res = context.switchToHttp().getResponse<Response>();
    const message = this.formatLogMessage(ctx, res.statusCode);
    this.logger.log(message);
  }

  private logError(error: { status?: number }, ctx: RequestContext): void {
    const status = error.status ?? 500;
    const message = this.formatLogMessage(ctx, status);
    this.logger.warn(message);
  }

  private formatLogMessage(ctx: RequestContext, statusCode: number): string {
    const duration = Date.now() - ctx.startTime;
    return `${ctx.method} ${ctx.url} ${statusCode} - ${duration}ms - ${ctx.userId} - ${ctx.ip} - ${ctx.userAgent}`;
  }
}
