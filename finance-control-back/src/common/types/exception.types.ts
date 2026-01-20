export interface ExceptionDetails {
  status: number;
  message: string;
  stack?: string;
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}
