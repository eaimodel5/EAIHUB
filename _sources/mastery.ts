import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { store, createAudit } from '../store';

const masterySchema = z.object({
  userId: z.string().min(1),
  pathId: z.string().min(1),
  currentNodeId: z.string().nullable(),
  status: z.enum(['INTRO', 'WORKING', 'CHECKING', 'MASTERED']),
  evidence: z
    .object({
      nodeId: z.string(),
      evidence: z.string(),
      score: z.number().optional()
    })
    .optional()
});

const keyFor = (userId: string, pathId: string) => `${userId}:${pathId}`;

export const registerMasteryRoutes = async (app: FastifyInstance) => {
  app.get('/api/mastery', async (request, reply) => {
    const query = request.query as { userId?: string; pathId?: string };
    if (!query.userId) return reply.code(400).send({ error: 'userId required' });

    if (query.pathId) {
      const item = store.mastery.get(keyFor(query.userId, query.pathId)) || null;
      return reply.send({ item });
    }

    const items = Array.from(store.mastery.values()).filter((m) => m.userId === query.userId);
    return reply.send({ items });
  });

  app.put('/api/mastery', async (request, reply) => {
    const parsed = masterySchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Invalid payload', details: parsed.error.flatten() });
    }

    const { userId, pathId, currentNodeId, status, evidence } = parsed.data;
    const key = keyFor(userId, pathId);
    const existing = store.mastery.get(key) || {
      userId,
      pathId,
      currentNodeId: null,
      status: 'INTRO' as const,
      history: []
    };

    if (evidence) {
      existing.history.push({
        nodeId: evidence.nodeId,
        evidence: evidence.evidence,
        createdAt: Date.now(),
        score: evidence.score ?? null
      });
    }

    const updated = {
      ...existing,
      currentNodeId,
      status
    };

    store.mastery.set(key, updated);
    const audit = createAudit(userId, 'MASTERY_UPDATED', { pathId, currentNodeId, status });

    return reply.send({ ok: true, mastery: updated, auditId: audit.id });
  });
};
