import { HttpStatus } from '@nestjs/common';
import type { ExceptionDetails } from '../types';

export const PRISMA_ERROR_MAP: Record<string, ExceptionDetails> = {
  // constraint violations
  P2002: { status: HttpStatus.CONFLICT, message: 'Resource already exists' },
  P2003: { status: HttpStatus.BAD_REQUEST, message: 'Foreign key constraint failed' },
  P2004: { status: HttpStatus.BAD_REQUEST, message: 'Database constraint failed' },

  // not found
  P2001: { status: HttpStatus.NOT_FOUND, message: 'Record not found' },
  P2015: { status: HttpStatus.NOT_FOUND, message: 'Related record not found' },
  P2018: { status: HttpStatus.NOT_FOUND, message: 'Required connected records not found' },
  P2025: { status: HttpStatus.NOT_FOUND, message: 'Resource not found' },

  // invalid data
  P2005: { status: HttpStatus.BAD_REQUEST, message: 'Invalid field value' },
  P2006: { status: HttpStatus.BAD_REQUEST, message: 'Invalid value provided' },
  P2007: { status: HttpStatus.BAD_REQUEST, message: 'Data validation error' },
  P2011: { status: HttpStatus.BAD_REQUEST, message: 'Null constraint violation' },
  P2012: { status: HttpStatus.BAD_REQUEST, message: 'Missing required value' },
  P2013: { status: HttpStatus.BAD_REQUEST, message: 'Missing required argument' },
  P2014: { status: HttpStatus.BAD_REQUEST, message: 'Required relation violation' },

  // connection/timeout
  P2024: { status: HttpStatus.REQUEST_TIMEOUT, message: 'Database operation timed out' },
  P2028: { status: HttpStatus.SERVICE_UNAVAILABLE, message: 'Transaction API error' },
};
