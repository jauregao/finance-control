import { ConfigService } from '@nestjs/config';
import type { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig = (configService: ConfigService): JwtModuleOptions => ({
  secret: configService.getOrThrow('JWT_SECRET'),
  signOptions: { expiresIn: '1h' },
});
