import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  FIREBASE_SERVICE_ACCOUNT_KEY_PATH: z.string().min(1, 'FIREBASE_SERVICE_ACCOUNT_KEY_PATH is required'),
  CORS_ORIGINS: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.issues
      .map((e) => {
        const path = e.path.length > 0 ? e.path.join('.') : 'root';
        return `  - ${path}: ${e.message}`;
      })
      .join('\n');

    console.error('Environment validation failed:');
    console.error(errors);
    console.error('\nMake sure you have a .env file with all required variables.');
    console.error('   Check env-example for reference.\n');

    throw new Error(`Environment validation failed:\n${errors}`);
  }

  return result.data;
}
