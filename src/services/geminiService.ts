import { GoogleGenAI, Type, Schema } from "@google/genai";
import { EAIAnalysis, MechanicalState, LearnerProfile, LearningNode } from '../types';
import { getEAICore } from '../utils/ssotParser';
import { validateAnalysisAgainstSSOT, calculateGFactor } from '../utils/eaiLearnAdapter';
import { getLearningPath } from '../data/curriculum';
import { getOrCreateUserId } from './identity';
import { fetchMastery, updateMastery } from './masteryService';

const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

let sessionId = '';

const ensureSessionId = () => {
  if (!sessionId) {
    sessionId = (globalThis.crypto?.randomUUID?.() || `sess_${Date.now()}`);
  }
  return sessionId;
};

// --- SCHEMA DEFINITION (INLINED) ---
const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    analysis: {
      type: Type.OBJECT,
      properties: {
        process_phases: { type: Type.ARRAY, items: { type: Type.STRING } },
        coregulation_bands: { type: Type.ARRAY, items: { type: Type.STRING } },
        task_densities: { type: Type.ARRAY, items: { type: Type.STRING } },
        secondary_dimensions: { type: Type.ARRAY, items: { type: Type.STRING } },
        active_fix: { type: Type.STRING, nullable: true },
        reasoning: { type: Type.STRING },
        current_profile: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, nullable: true },
            subject: { type: Type.STRING, nullable: true },
            level: { type: Type.STRING, nullable: true },
            grade: { type: Type.STRING, nullable: true },
            goal: { type: Type.STRING, nullable: true }
          }
        },
        task_density_balance: { type: Type.NUMBER },
        epistemic_status: { type: Type.STRING },
        cognitive_mode: { type: Type.STRING },
        srl_state: { type: Type.STRING, enum: ['PLAN', 'MONITOR', 'REFLECT', 'ADJUST', 'UNKNOWN'] },
        mastery_check: { type: Type.BOOLEAN }
      },
      required: [
        'process_phases',
        'coregulation_bands',
        'task_densities',
        'reasoning',
        'task_density_balance',
        'srl_state'
      ]
    },
    conversational_response: { type: Type.STRING }
  },
  required: ['analysis', 'conversational_response'],
  propertyOrdering: ['analysis', 'conversational_response']
};

// --- LOGIC PORTED FROM BACKEND ORCHESTRATOR ---

const RUIJSSENAARS_THEORY = `
THEORETISCH KADER (RUIJSSENAARS):
1. FEITENKENNIS (K1): Doel=Automatiseren. Aanpak=Inprenten/Flitsen. Fout=Vragen naar inzicht.
2. PROCEDURELE KENNIS (K2): Doel=Uitvoeren. Aanpak=Modeling (voordoen -> samen -> zelf).
3. METACOGNITIE (K3): Doel=Regie. Aanpak=Reflectie/Monitoring.
`;

const generateSystemPrompt = (profile: LearnerProfile, currentNode: LearningNode | null) => {
  const core = getEAICore();
  const context = {
    rubrics: core.rubrics,
    commands: core.commands,
    gates: core.interaction_protocol?.logic_gates || [],
    diagnostics: core.didactic_diagnostics,
  };

  let curriculumContext = "";
  if (currentNode) {
      curriculumContext = `
ACTIEVE LEERLIJN MODULE:
- Huidige Stap: ${currentNode.title}
- ID: ${currentNode.id}
- Leerdoel: ${currentNode.description}
- Didactische Focus: ${currentNode.didactic_focus}
- Mastery Criteria (Wanneer is het 'AF'?): ${currentNode.mastery_criteria}
- Veelgemaakte fouten: ${currentNode.common_misconceptions?.join(', ')}

INSTRUCTIE: 
Focus je coaching SPECIFIEK op deze stap. 
Als je overtuigd bent dat de leerling dit beheerst volgens de criteria, zet dan 'mastery_check: true' in je analyse.
`;
  }

  return `
Je bent de EAI Leercoach (NL). Je bent strikt gebonden aan de volgende SSOT Architectuur v15.0.

CONTEXT DATA:
${JSON.stringify(context)}

${RUIJSSENAARS_THEORY}

PROFIEL LEERLING:
${JSON.stringify(profile)}

${curriculumContext}

PROTOCOL:
1. Analyseer de input op P (Fase), TD (Taakdichtheid), C (Co-regulatie) en K (Kennis).
2. CONTROLEER 'LOGIC GATES': Als een gate getriggerd wordt (bijv. K1=Feitenkennis), MOET je de 'enforcement' regel volgen.
3. SINGLE QUESTION RULE: Stel maximaal 1 vraag per bericht.
4. JSON OUTPUT ONLY.
`;
};

// Anti-Leakage: remove internal SSOT codes from the output text presented to user
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
  return !!(import.meta as any).env?.VITE_GEMINI_API_KEY;
};

export const resetChatSession = () => {
  sessionId = '';
};

// Main Chat Function
export const sendMessageToGemini = async (
  message: string,
  onStatus: (status: string) => void,
  profile: LearnerProfile
): Promise<{ text: string; analysis: EAIAnalysis; mechanical: MechanicalState }> => {
  ensureSessionId();
  onStatus('Genereren...');
  
  const start = Date.now();
  const userId = getOrCreateUserId();

  // 1. Resolve Mastery State (Client-Side Logic)
  let currentNode: LearningNode | null = null;
  let activePathId: string | null = null;

  if (profile.subject && profile.level) {
      const path = getLearningPath(profile.subject, profile.level);
      if (path) {
          activePathId = `${path.subject}_${path.level}`.toUpperCase().replace(/\s/g, '');
          const masteryRes = await fetchMastery(userId, activePathId);
          let mastery = masteryRes.item;
          
          if (!mastery) {
              // Initialize mastery if not exists
              mastery = {
                  userId,
                  pathId: activePathId,
                  currentNodeId: path.nodes[0].id,
                  status: 'INTRO',
                  history: []
              };
              await updateMastery(mastery);
          }
          currentNode = path.nodes.find(n => n.id === mastery!.currentNodeId) || path.nodes[0];
      }
  }

  // 2. Call Gemini
  try {
      const prompt = generateSystemPrompt(profile, currentNode);
      
      const result = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // High reasoning model
        contents: [{ role: 'user', parts: [{ text: message }] }],
        config: {
            systemInstruction: prompt,
            responseMimeType: 'application/json',
            responseSchema: responseSchema
        }
      });

      const rawText = result.text || '{}';
      let parsed: any;
      try {
          parsed = JSON.parse(rawText);
      } catch (e) {
          console.error("Failed to parse JSON", rawText);
          parsed = { 
              conversational_response: "Er is een technische fout opgetreden bij het verwerken van het antwoord.",
              analysis: { reasoning: "JSON Parse Error" }
          };
      }

      let analysis: EAIAnalysis = parsed.analysis || {};
      const text = parsed.conversational_response || "";

      // Validate & Heal Analysis
      const validation = validateAnalysisAgainstSSOT(analysis);
      analysis = validation.healedAnalysis;

      const end = Date.now();
      const latencyMs = end - start;
      const gFactor = calculateGFactor(analysis);

      const mechanical: MechanicalState = {
          latencyMs,
          inputTokens: 0, 
          outputTokens: 0,
          model: 'gemini-3-pro-preview',
          temperature: 0.4,
          timestamp: new Date().toISOString(),
          logicGateBreach: validation.logicGateBreach,
          repairAttempts: validation.warnings.length > 0 ? 1 : 0,
          repairLog: validation.warnings.length > 0 ? {
              timestamp: Date.now(),
              error: 'SSOT Deviation',
              brokenPayload: JSON.stringify(validation.warnings)
          } : undefined,
          semanticValidation: gFactor
      };

      // 3. Update Mastery if needed
      if (analysis.mastery_check && currentNode && activePathId) {
          const path = getLearningPath(profile.subject!, profile.level!);
          if (path) {
              const currentIndex = path.nodes.findIndex(n => n.id === currentNode!.id);
              const nextNode = path.nodes[currentIndex + 1];
              
              const updatePayload = {
                  userId,
                  pathId: activePathId,
                  currentNodeId: nextNode ? nextNode.id : null,
                  status: nextNode ? 'INTRO' : 'MASTERED',
                  evidence: {
                      nodeId: currentNode.id,
                      evidence: "AI_CONFIRMED",
                      score: 100
                  }
              } as any;
              
              await updateMastery(updatePayload);
          }
      }

      return {
        text: applyAntiLeakage(text),
        analysis,
        mechanical
      };

  } catch (error) {
      console.error(error);
      throw error;
  }
};

export const sendSystemNudge = async (
  lastAnalysis: EAIAnalysis,
  profile: LearnerProfile,
  level: number
): Promise<{ text: string; analysis: EAIAnalysis; mechanical: MechanicalState }> => {
  ensureSessionId();
  const start = Date.now();
  
  const prompt = `Geef een korte nudge (niveau ${level}) die de leerling helpt doorgaan. Baseer je op de vorige analyse: ${JSON.stringify(lastAnalysis)}. Max 1 vraag.`;
  const core = getEAICore();
  
  const systemPrompt = `Je bent de EAI Leercoach. Reageer kort en activerend. Gebruik SSOT v15. JSON Output.`;

  try {
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', 
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            responseSchema: responseSchema
        }
      });
      
      const rawText = result.text || '{}';
      const parsed = JSON.parse(rawText);
      let analysis: EAIAnalysis = parsed.analysis || {};
      const text = parsed.conversational_response || "";
      
      const validation = validateAnalysisAgainstSSOT(analysis);
      analysis = validation.healedAnalysis;

      const mechanical: MechanicalState = {
          latencyMs: Date.now() - start,
          inputTokens: 0,
          outputTokens: 0,
          model: 'gemini-3-flash-preview',
          temperature: 0.4,
          timestamp: new Date().toISOString(),
          semanticValidation: calculateGFactor(analysis)
      };

      return {
          text: applyAntiLeakage(text),
          analysis,
          mechanical
      };
  } catch(e) {
      throw e;
  }
};