import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { generateNudgeResponse } from '../ai/orchestrator';

const nudgeSchema = z.object({
  sessionId: z.string().min(1),
  level: z.number().min(1).max(5),
  profile: z.object({
    name: z.string().nullable(),
    subject: z.string().nullable(),
    level: z.string().nullable(),
    grade: z.string().nullable(),
    goal: z.string().nullable().optional()
  }),
  lastAnalysis: z.any().nullable()
});

export const registerNudgeRoutes = async (app: FastifyInstance) => {
  app.post('/api/nudge', async (request, reply) => {
    const parsed = nudgeSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Invalid payload', details: parsed.error.flatten() });
    }

    const response = await generateNudgeResponse(parsed.data);
    return reply.send(response);
  });
};
