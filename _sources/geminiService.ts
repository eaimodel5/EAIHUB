import { EAIAnalysis, MechanicalState, LearnerProfile } from '../types';
import { getEAICore } from '../utils/ssotParser';
import { apiFetch } from './apiClient';

let sessionId = '';

const ensureSessionId = () => {
  if (!sessionId) {
    sessionId = (globalThis.crypto?.randomUUID?.() || `sess_${Date.now()}`);
  }
  return sessionId;
};

const applyAntiLeakage = (text: string): string => {
  const core = getEAICore();
  let cleaned = text;
  core.commands.forEach(cmd => {
    const regex = new RegExp(`${cmd.command}\\b`, 'g');
    cleaned = cleaned.replace(regex, '');
  });
  const allBands = core.rubrics.flatMap(r => r.bands.map(b => b.band_id));
  allBands.forEach(band => {
    const regex = new RegExp(`(\\[${band}\\]|\\(${band}\\)|\\b${band}\\b)`, 'g');
    cleaned = cleaned.replace(regex, '');
  });
  return cleaned.replace(/\s+/g, ' ').trim();
};

export const checkApiKeyConfigured = (): boolean => {
  return true;
};

export const resetChatSession = () => {
  sessionId = '';
};

export const sendMessageToGemini = async (
  message: string,
  onStatus?: (status: string) => void,
  profile?: LearnerProfile
): Promise<{ text: string; analysis: EAIAnalysis; mechanical: MechanicalState }> => {
  const activeSessionId = ensureSessionId();
  onStatus?.('Versturen...');

  const response = await apiFetch<{ text: string; analysis: EAIAnalysis; mechanical: MechanicalState }>(
    '/api/chat',
    {
      method: 'POST',
      body: {
        sessionId: activeSessionId,
        message,
        profile: profile || { name: null, subject: null, level: null, grade: null }
      }
    }
  );

  return {
    text: applyAntiLeakage(response.text || ''),
    analysis: response.analysis,
    mechanical: response.mechanical
  };
};

export const sendSystemNudge = async (
  lastAnalysis: EAIAnalysis,
  profile: LearnerProfile,
  level: number
): Promise<{ text: string; analysis: EAIAnalysis; mechanical: MechanicalState }> => {
  const activeSessionId = ensureSessionId();
  const response = await apiFetch<{ text: string; analysis: EAIAnalysis; mechanical: MechanicalState }>(
    '/api/nudge',
    {
      method: 'POST',
      body: {
        sessionId: activeSessionId,
        level,
        profile,
        lastAnalysis
      }
    }
  );

  return {
    text: applyAntiLeakage(response.text || ''),
    analysis: response.analysis,
    mechanical: response.mechanical
  };
};
