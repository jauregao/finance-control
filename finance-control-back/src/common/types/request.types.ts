import type { Request } from 'express';

export interface RequestContext {
  method: string;
  url: string;
  ip: string;
  userAgent: string;
  userId: string;
  startTime: number;
}

export type AuthenticatedRequest = Request & {
  user?: {
    userId?: string;
    email?: string;
  };
};
