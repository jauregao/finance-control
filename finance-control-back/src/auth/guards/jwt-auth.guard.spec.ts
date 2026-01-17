import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  it('should be defined', () => {
    const guard = new JwtAuthGuard();
    expect(guard).toBeDefined();
  });

  it('should extend AuthGuard("jwt")', () => {
    const guard = new JwtAuthGuard();

    expect(guard).toBeInstanceOf(AuthGuard('jwt') as any);
  });
});
