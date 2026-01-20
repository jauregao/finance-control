import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
  });

  it('should be defined', () => {
    const guard = new JwtAuthGuard(reflector);
    expect(guard).toBeDefined();
  });

  it('should extend AuthGuard("jwt")', () => {
    const guard = new JwtAuthGuard(reflector);

    expect(guard).toBeInstanceOf(AuthGuard('jwt') as any);
  });
});
