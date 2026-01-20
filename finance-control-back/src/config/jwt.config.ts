import { ConfigService } from '@nestjs/config';
import type { JwtModuleOptions } from '@nestjs/jwt';
import { getJwtSecret } from 'src/auth/constants';

export const jwtConfig = (configService: ConfigService): JwtModuleOptions => ({
  secret: getJwtSecret(configService),
  signOptions: { expiresIn: '1h' },
});
