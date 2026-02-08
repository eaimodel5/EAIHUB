import type { FastifyInstance } from 'fastify';
import { store } from '../store';

export const registerAnalyticsRoutes = async (app: FastifyInstance) => {
  app.get('/api/analytics', async () => {
    const activeSessions = store.sessionMessageCount.size;
    const totalMessages = Array.from(store.sessionMessageCount.values()).reduce((a, b) => a + b, 0);
    const avgLatencyMs = store.sessionLatency.length
      ? Math.round(store.sessionLatency.reduce((a, b) => a + b, 0) / store.sessionLatency.length)
      : 0;
    const breachRate = totalMessages > 0 ? store.breaches.length / totalMessages : 0;

    return {
      activeSessions,
      totalMessages,
      avgLatencyMs,
      breachRate,
      updatedAt: Date.now()
    };
  });
};
