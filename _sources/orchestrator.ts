import { GoogleGenAI } from '@google/genai';
import type { ChatRequest, ChatResponse, EAIAnalysis, LearnerProfile, MechanicalState, NudgeRequest } from '../types';
import { responseSchema } from './schema';
import { createAudit, createBreach, incrementSessionMessageCount, recordLatency } from '../store';

const MODEL_PRO = 'gemini-3-pro-preview';
const MODEL_FLASH = 'gemini-3-flash-preview';

const SYSTEM_PROMPT = `Je bent de EAI Leercoach (NL). Houd je aan het SINGLE QUESTION RULE: max 1 vraag per antwoord.\n\nOUTPUT: uitsluitend JSON met velden 'analysis' en 'conversational_response'.`;

const scrubPII = (input: string): { scrubbed: string; detected: string[] } => {
  const detected: string[] = [];
  let output = input;

  const patterns: Array<{ label: string; regex: RegExp }> = [
    { label: 'email', regex: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi },
    { label: 'phone', regex: /\b(\+?\d[\d\s().-]{7,}\d)\b/g },
    { label: 'bsn', regex: /\b\d{9}\b/g }
  ];

  patterns.forEach(({ label, regex }) => {
    if (regex.test(output)) detected.push(label);
    output = output.replace(regex, `[REDACTED_${label.toUpperCase()}]`);
  });

  return { scrubbed: output, detected };
};

const normalizeAnalysis = (a: any, profile: LearnerProfile): EAIAnalysis => {
  const asStrArray = (v: any) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []);
  const srl = typeof a?.srl_state === 'string' ? a.srl_state : 'UNKNOWN';

  return {
    process_phases: asStrArray(a?.process_phases),
    coregulation_bands: asStrArray(a?.coregulation_bands),
    task_densities: asStrArray(a?.task_densities),
    secondary_dimensions: asStrArray(a?.secondary_dimensions),
    active_fix: typeof a?.active_fix === 'string' ? a.active_fix : null,
    reasoning: typeof a?.reasoning === 'string' ? a.reasoning : '',
    current_profile: a?.current_profile || profile,
    task_density_balance: typeof a?.task_density_balance === 'number' ? a.task_density_balance : 50,
    epistemic_status: typeof a?.epistemic_status === 'string' ? a.epistemic_status : 'ONBEKEND',
    cognitive_mode: typeof a?.cognitive_mode === 'string' ? a.cognitive_mode : 'ONBEKEND',
    srl_state: ['PLAN', 'MONITOR', 'REFLECT', 'ADJUST', 'UNKNOWN'].includes(srl) ? srl : 'UNKNOWN',
    mastery_check: !!a?.mastery_check
  };
};

const buildMechanical = (latencyMs: number, model: string, inputTokens = 0, outputTokens = 0): MechanicalState => ({
  latencyMs,
  inputTokens,
  outputTokens,
  model,
  temperature: 0.4,
  timestamp: new Date().toISOString()
});

const evaluateBreaches = (analysis: EAIAnalysis, sessionId: string) => {
  const td = analysis.task_densities.find((b) => b.startsWith('TD'));
  const p = analysis.process_phases.find((b) => b.startsWith('P'));
  if (td === 'TD5' && p === 'P3') {
    return createBreach(sessionId, 'LOGIC_GATE_TD5_P3', 'HIGH', {
      detected: { td, p }
    });
  }
  return null;
};

const estimateTokens = (text: string) => Math.ceil(text.length / 4);

const mockResponse = (message: string, profile: LearnerProfile) => {
  const analysis: EAIAnalysis = {
    process_phases: ['P2'],
    coregulation_bands: ['C2'],
    task_densities: ['TD3'],
    secondary_dimensions: ['E2'],
    active_fix: null,
    reasoning: 'Heuristic fallback (no API key).',
    current_profile: profile,
    task_density_balance: 50,
    epistemic_status: 'INTERPRETATIE',
    cognitive_mode: 'PRAGMATISCH',
    srl_state: 'MONITOR',
    mastery_check: false
  };

  return {
    analysis,
    text: `Ik heb je input ontvangen. Wat is je exacte leerdoel voor vandaag? (fallback)`
  };
};

const callGemini = async (message: string, profile: LearnerProfile) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;

  const genAI = new GoogleGenAI({ apiKey });

  const prompt = `${SYSTEM_PROMPT}\n\nProfiel: ${JSON.stringify(profile)}\n\nInput: ${message}`;

  const result = await genAI.models.generateContent({
    model: MODEL_PRO,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      responseMimeType: 'application/json',
      responseSchema
    }
  });

  const raw = result.text || '';
  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    return null;
  }

  return {
    analysis: parsed.analysis,
    text: parsed.conversational_response
  };
};

export const generateChatResponse = async (payload: ChatRequest): Promise<ChatResponse> => {
  const start = Date.now();
  incrementSessionMessageCount(payload.sessionId);

  const { scrubbed, detected } = scrubPII(payload.message);
  const audit = createAudit(payload.sessionId, 'CHAT_RECEIVED', {
    detectedPII: detected,
    scrubbed
  });

  const modelResult = (await callGemini(scrubbed, payload.profile)) ?? mockResponse(scrubbed, payload.profile);

  const analysis = normalizeAnalysis(modelResult.analysis, payload.profile);
  const latencyMs = Date.now() - start;
  const mechanical = buildMechanical(
    latencyMs,
    process.env.API_KEY ? MODEL_PRO : 'mock',
    estimateTokens(scrubbed),
    estimateTokens(modelResult.text)
  );
  recordLatency(latencyMs);

  const breach = evaluateBreaches(analysis, payload.sessionId);
  if (breach) {
    mechanical.logicGateBreach = {
      trigger_band: breach.breachType,
      rule_description: 'TD5 not allowed during P3 (stub gate)',
      detected_value: breach.details?.detected ? JSON.stringify(breach.details.detected) : null,
      priority: breach.severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH'
    };
  }

  return {
    sessionId: payload.sessionId,
    text: modelResult.text,
    analysis,
    mechanical,
    auditId: audit.id
  };
};

export const generateNudgeResponse = async (payload: NudgeRequest) => {
  const start = Date.now();
  incrementSessionMessageCount(payload.sessionId);

  const prompt = `Geef een korte nudge (niveau ${payload.level}) die de leerling helpt doorgaan. Max 1 vraag.`;
  const modelResult = (await callGemini(prompt, payload.profile)) ?? mockResponse(prompt, payload.profile);

  const analysis = normalizeAnalysis(modelResult.analysis, payload.profile);
  const latencyMs = Date.now() - start;
  const mechanical = buildMechanical(
    latencyMs,
    process.env.API_KEY ? MODEL_FLASH : 'mock',
    estimateTokens(prompt),
    estimateTokens(modelResult.text)
  );
  recordLatency(latencyMs);

  return {
    sessionId: payload.sessionId,
    text: modelResult.text,
    analysis,
    mechanical,
    auditId: createAudit(payload.sessionId, 'NUDGE_SENT', { level: payload.level }).id
  };
};