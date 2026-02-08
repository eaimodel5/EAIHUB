import Fastify from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import envPlugin from './env';
import { registerChatRoutes } from './routes/chat';
import { registerNudgeRoutes } from './routes/nudge';
import { registerProfileRoutes } from './routes/profile';
import { registerMasteryRoutes } from './routes/mastery';
import { registerAssignmentRoutes } from './routes/assignment';
import { registerAnalyticsRoutes } from './routes/analytics';

const app = Fastify({ logger: true });

await app.register(envPlugin);
await app.register(cors, {
  origin: (origin, cb) => {
    const allowed = (app.config.ALLOWED_ORIGINS || '').split(',').map((o: string) => o.trim());
    if (!origin || allowed.includes(origin)) return cb(null, true);
    return cb(new Error('Origin not allowed'), false);
  }
});
await app.register(sensible);

await registerChatRoutes(app);
await registerNudgeRoutes(app);
await registerProfileRoutes(app);
await registerMasteryRoutes(app);
await registerAssignmentRoutes(app);
await registerAnalyticsRoutes(app);

app.get('/health', async () => ({ ok: true, timestamp: Date.now() }));

const port = Number(app.config.PORT || 3333);
try {
  await app.listen({ port, host: '0.0.0.0' });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
