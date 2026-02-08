import { apiFetch } from './apiClient';

export type MasteryUpdate = {
  userId: string;
  pathId: string;
  currentNodeId: string | null;
  status: 'INTRO' | 'WORKING' | 'CHECKING' | 'MASTERED';
  evidence?: {
    nodeId: string;
    evidence: string;
    score?: number;
  };
};

export const fetchMastery = (userId: string, pathId?: string) => {
  const params = new URLSearchParams();
  params.set('userId', userId);
  if (pathId) params.set('pathId', pathId);
  return apiFetch(`/api/mastery?${params.toString()}`);
};

export const updateMastery = (payload: MasteryUpdate) => {
  return apiFetch('/api/mastery', { method: 'PUT', body: payload });
};
