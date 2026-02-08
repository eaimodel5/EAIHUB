import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { store, createAudit } from '../store';

const profileSchema = z.object({
  userId: z.string().min(1),
  profile: z.object({
    name: z.string().nullable(),
    subject: z.string().nullable(),
    level: z.string().nullable(),
    grade: z.string().nullable(),
    goal: z.string().nullable().optional()
  }),
  consentScopes: z.array(z.string()).optional()
});

export const registerProfileRoutes = async (app: FastifyInstance) => {
  app.get('/api/profile', async (request, reply) => {
    const userId = (request.query as { userId?: string }).userId;
    if (!userId) return reply.code(400).send({ error: 'userId required' });

    const profile = store.profiles.get(userId) || null;

    return reply.send({ userId, profile });
  });

  app.put('/api/profile', async (request, reply) => {
    const parsed = profileSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Invalid payload', details: parsed.error.flatten() });
    }

    const { userId, profile, consentScopes } = parsed.data;

    const existing = store.users.get(userId) || { id: userId, name: profile.name || 'Student', role: 'STUDENT', classIds: [] };
    store.users.set(userId, { ...existing, name: profile.name || existing.name });
    store.profiles.set(userId, profile);

    if (consentScopes) {
      store.consents.set(userId, { userId, consentedAt: Date.now(), scopes: consentScopes });
    }

    const audit = createAudit(userId, 'PROFILE_UPDATED', { profile });
    return reply.send({ ok: true, auditId: audit.id });
  });
};
