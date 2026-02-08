import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { store, createAudit } from '../store';

const assignmentSchema = z.object({
  classId: z.string().nullable().optional(),
  studentId: z.string().nullable().optional(),
  pathId: z.string().min(1),
  dueAt: z.number().nullable().optional()
});

export const registerAssignmentRoutes = async (app: FastifyInstance) => {
  app.post('/api/assignment', async (request, reply) => {
    const parsed = assignmentSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Invalid payload', details: parsed.error.flatten() });
    }

    const id = randomUUID();
    const assignment = {
      id,
      classId: parsed.data.classId ?? null,
      studentId: parsed.data.studentId ?? null,
      pathId: parsed.data.pathId,
      createdAt: Date.now(),
      dueAt: parsed.data.dueAt ?? null
    };

    store.assignments.set(id, assignment);
    const audit = createAudit(id, 'ASSIGNMENT_CREATED', assignment);

    return reply.send({ ok: true, assignment, auditId: audit.id });
  });

  app.get('/api/assignment', async (request) => {
    const query = request.query as { classId?: string; studentId?: string };
    let assignments = Array.from(store.assignments.values());
    if (query.classId) assignments = assignments.filter((a) => a.classId === query.classId);
    if (query.studentId) assignments = assignments.filter((a) => a.studentId === query.studentId);
    return { assignments };
  });
};
