import { EnvConfig } from "./env.validation";

export function corsConfig(env: EnvConfig) {
  return {
    origin: env.NODE_ENV === 'production'
      ? env.CORS_ORIGINS?.split(',') || []
      : ['http://localhost:8081', 'http://localhost:19006'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  }
}
