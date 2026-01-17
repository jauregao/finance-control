import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
    jest.spyOn(filter['logger'], 'error').mockImplementation(() => {});
  });

  it('should format exception response', () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockRequest = { method: 'GET', url: '/test' };
    const mockHttpContext = {
      getRequest: () => mockRequest,
      getResponse: () => mockResponse,
    };

    const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);

    filter['catch'](exception, {
      switchToHttp: () => mockHttpContext,
    } as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Test error',
    });
  });
});
