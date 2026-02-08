import 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      PORT: string;
      PUBLIC_BASE_URL: string;
      GEMINI_API_KEY: string;
      ALLOWED_ORIGINS: string;
      LOG_LEVEL: string;
    };
  }
}
