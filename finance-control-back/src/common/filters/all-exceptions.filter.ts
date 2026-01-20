import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { PRISMA_ERROR_MAP } from '../constants';
import type { ExceptionDetails } from '../types';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const { status, message, stack } = this.getExceptionDetails(exception);

    this.logger.error(`HTTP ${status} ${req.method} ${req.url} - ${message}`, stack);

    res.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: req.url,
    });
  }

  private getExceptionDetails(exception: unknown): ExceptionDetails {
    if (exception instanceof HttpException) {
      return this.parseHttpException(exception);
    }

    if (exception instanceof Error) {
      return this.parseError(exception);
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    };
  }

  private parseHttpException(exception: HttpException): ExceptionDetails {
    const response = exception.getResponse();
    const message =
      typeof response === 'string'
        ? response
        : (response as { message?: string }).message || exception.message;

    return {
      status: exception.getStatus(),
      message,
      stack: exception.stack,
    };
  }

  private parseError(exception: Error): ExceptionDetails {
    const prismaDetails = this.parsePrismaError(exception);
    if (prismaDetails) {
      return { ...prismaDetails, stack: exception.stack };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception.message,
      stack: exception.stack,
    };
  }

  private parsePrismaError(exception: Error): ExceptionDetails | null {
    const isPrismaError = exception.constructor.name === 'PrismaClientKnownRequestError';
    if (!isPrismaError) {
      return null;
    }

    const code = (exception as { code?: string }).code;
    return code ? PRISMA_ERROR_MAP[code] ?? null : null;
  }
}
