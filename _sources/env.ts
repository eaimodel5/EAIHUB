import fp from 'fastify-plugin';
import env from '@fastify/env';

const schema = {
  type: 'object',
  required: ['PORT'],
  properties: {
    PORT: { type: 'string', default: '3333' },
    PUBLIC_BASE_URL: { type: 'string', default: 'http://localhost:3333' },
    GEMINI_API_KEY: { type: 'string', default: '' },
    ALLOWED_ORIGINS: { type: 'string', default: 'http://localhost:5173' },
    LOG_LEVEL: { type: 'string', default: 'info' }
  }
};

export default fp(async (app) => {
  await app.register(env, { schema, dotenv: true });
});
