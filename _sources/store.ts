import { randomUUID } from 'node:crypto';
import type {
  Assignment,
  AuditEvent,
  BreachEvent,
  Classroom,
  ConsentRecord,
  MasteryStateV2,
  User
} from './types';

export interface Store {
  users: Map<string, User>;
  profiles: Map<string, Record<string, unknown>>;
  classrooms: Map<string, Classroom>;
  assignments: Map<string, Assignment>;
  consents: Map<string, ConsentRecord>;
  mastery: Map<string, MasteryStateV2>;
  audits: AuditEvent[];
  breaches: BreachEvent[];
  sessionMessageCount: Map<string, number>;
  sessionLatency: number[];
}

export const store: Store = {
  users: new Map(),
  profiles: new Map(),
  classrooms: new Map(),
  assignments: new Map(),
  consents: new Map(),
  mastery: new Map(),
  audits: [],
  breaches: [],
  sessionMessageCount: new Map(),
  sessionLatency: []
};

export const createAudit = (sessionId: string, action: string, details: Record<string, unknown> = {}) => {
  const event: AuditEvent = {
    id: randomUUID(),
    sessionId,
    timestamp: Date.now(),
    action,
    details
  };
  store.audits.push(event);
  return event;
};

export const createBreach = (
  sessionId: string,
  breachType: string,
  severity: BreachEvent['severity'],
  details: Record<string, unknown> = {}
) => {
  const event: BreachEvent = {
    id: randomUUID(),
    sessionId,
    timestamp: Date.now(),
    breachType,
    severity,
    details
  };
  store.breaches.push(event);
  return event;
};

export const incrementSessionMessageCount = (sessionId: string) => {
  const current = store.sessionMessageCount.get(sessionId) ?? 0;
  store.sessionMessageCount.set(sessionId, current + 1);
};

export const recordLatency = (latencyMs: number) => {
  if (!Number.isFinite(latencyMs)) return;
  store.sessionLatency.push(latencyMs);
  if (store.sessionLatency.length > 500) {
    store.sessionLatency.shift();
  }
};
