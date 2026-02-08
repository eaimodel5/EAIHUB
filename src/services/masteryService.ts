// CLIENT-SIDE STORAGE for Mastery
import { MasteryStateV2 } from '../types';

const MASTERY_STORAGE_PREFIX = 'eai_mastery_local_';

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

export const fetchMastery = async (userId: string, pathId?: string) => {
  if (pathId) {
      const key = `${MASTERY_STORAGE_PREFIX}${userId}_${pathId}`;
      const stored = localStorage.getItem(key);
      return { item: stored ? JSON.parse(stored) : null, items: [] };
  }
  return { items: [] }; // List all not implemented for local simple version
};

export const updateMastery = async (payload: MasteryUpdate) => {
  const key = `${MASTERY_STORAGE_PREFIX}${payload.userId}_${payload.pathId}`;
  
  const existingStr = localStorage.getItem(key);
  let mastery: MasteryStateV2;
  
  if (existingStr) {
      mastery = JSON.parse(existingStr);
      mastery.status = payload.status;
      mastery.currentNodeId = payload.currentNodeId;
      if (payload.evidence) {
          mastery.history.push({
              nodeId: payload.evidence.nodeId,
              evidence: payload.evidence.evidence,
              createdAt: Date.now(),
              score: payload.evidence.score || null
          });
      }
  } else {
      mastery = {
          userId: payload.userId,
          pathId: payload.pathId,
          currentNodeId: payload.currentNodeId,
          status: payload.status,
          history: payload.evidence ? [{
              nodeId: payload.evidence.nodeId,
              evidence: payload.evidence.evidence,
              createdAt: Date.now(),
              score: payload.evidence.score || null
          }] : []
      };
  }
  
  localStorage.setItem(key, JSON.stringify(mastery));
  return { ok: true, mastery };
};