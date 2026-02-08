import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { generateChatResponse } from '../ai/orchestrator';

const chatSchema = z.object({
  sessionId: z.string().min(1),
  message: z.string().min(1),
  profile: z.object({
    name: z.string().nullable(),
    subject: z.string().nullable(),
    level: z.string().nullable(),
    grade: z.string().nullable(),
    goal: z.string().nullable().optional()
  })
});

export const registerChatRoutes = async (app: FastifyInstance) => {
  app.post('/api/chat', async (request, reply) => {
    const parsed = chatSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Invalid payload', details: parsed.error.flatten() });
    }

    const response = await generateChatResponse(parsed.data);
    return reply.send(response);
  });
};
