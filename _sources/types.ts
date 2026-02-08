// --- USER & AUTH ---
export type Role = 'STUDENT' | 'TEACHER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  role: Role;
  classIds?: string[];
}

export interface Classroom {
  id: string;
  name: string;
  teacherIds: string[];
  studentIds: string[];
}

export interface LearnerProfile {
  name: string | null;
  subject: string | null;
  level: string | null;
  grade: string | null;
  goal?: string | null;
}

export interface ConsentRecord {
  userId: string;
  consentedAt: number;
  scopes: string[];
}

// --- CURRICULUM & MASTERY ---
export interface LearningNode {
    id: string;
    title: string;
    description: string;
    slo_ref: string;
    didactic_focus: string;
    mastery_criteria: string;
    example_question: string;
    study_load_minutes?: number;
    prerequisite_ids?: string[];
    micro_steps?: string[];
    common_misconceptions?: string[];
}

export interface LearningPath {
    subject: string;
    level: string;
    topic: string;
    nodes: LearningNode[];
}

export interface LearningNodeEvidence {
  nodeId: string;
  evidence: string;
  createdAt: number;
  score?: number | null;
}

export interface MasteryStateV2 {
  userId: string;
  pathId: string;
  currentNodeId: string | null;
  status: 'INTRO' | 'WORKING' | 'CHECKING' | 'MASTERED';
  history: LearningNodeEvidence[];
}

export interface Assignment {
  id: string;
  classId?: string | null;
  studentId?: string | null;
  pathId: string;
  createdAt: number;
  dueAt?: number | null;
}

// --- EAI ENGINE STATES ---
export type CognitiveMode = 'ANALYTISCH' | 'REFLECTIEF' | 'SYSTEMISCH' | 'PRAGMATISCH' | 'CREATIEF' | 'NORMATIEF' | 'ONBEKEND';
export type SRLState = 'PLAN' | 'MONITOR' | 'REFLECT' | 'ADJUST' | 'UNKNOWN';

export interface ScaffoldingState {
    agency_score: number; 
    trend: 'RISING' | 'STABLE' | 'FALLING';
    advice: string | null;
    history_window: number[];
}

export interface LogicGateBreach {
  trigger_band: string;     
  rule_description: string; 
  detected_value: string | null; 
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export interface SemanticValidation {
    gFactor: number; 
    penalties: string[]; 
    alignment_status: 'OPTIMAL' | 'DRIFT' | 'CRITICAL';
}

export interface RepairLog {
  timestamp: number;
  error: string;
  brokenPayload: string;
}

export interface SupervisorLog {
    timestamp: number;
    breach: LogicGateBreach;
    original_reasoning: string;
    correction_prompt: string;
}

export interface RouterDecision {
    target_model: string;
    thinking_budget: number;
    intent_category: 'FAST' | 'MID' | 'SLOW';
    reasoning: string;
}

export interface MechanicalState {
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  model: string;
  temperature: number;
  timestamp: string;
  repairAttempts?: number; 
  repairLog?: RepairLog;
  supervisorLog?: SupervisorLog;
  softValidationLog?: string[]; 
  logicGateBreach?: LogicGateBreach; 
  routerDecision?: RouterDecision;
  semanticValidation?: SemanticValidation; 
}

export interface EAIAnalysis {
  process_phases: string[]; 
  coregulation_bands: string[]; 
  task_densities: string[]; 
  secondary_dimensions: string[]; 
  active_fix: string | null; 
  reasoning: string;
  current_profile: LearnerProfile;
  task_density_balance: number; 
  epistemic_status: 'FEIT' | 'INTERPRETATIE' | 'SPECULATIE' | 'ONBEKEND';
  cognitive_mode: CognitiveMode;
  srl_state: SRLState;
  scaffolding?: ScaffoldingState;
  mastery_check?: boolean; 
}

// --- CHAT & UI ---
export enum GeminiModel {
  FLASH = 'gemini-3-flash-preview',
  PRO = 'gemini-3-pro-preview'
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
  analysis?: EAIAnalysis;
  mechanical?: MechanicalState;
}

export type DiagnosticStatus = 'OK' | 'WARNING' | 'CRITICAL';

export interface DiagnosticResult {
  id: string;
  category: 'ENV' | 'SSOT' | 'LOGIC';
  label: string;
  status: DiagnosticStatus;
  message: string;
  timestamp: number;
}

// --- SERVER TYPES ---

export interface AuditEvent {
  id: string;
  sessionId: string;
  timestamp: number;
  action: string;
  details: Record<string, unknown>;
}

export interface BreachEvent {
  id: string;
  sessionId: string;
  timestamp: number;
  breachType: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  details?: Record<string, unknown>;
}

export interface ChatRequest {
  sessionId: string;
  userId: string;
  message: string;
  profile: LearnerProfile;
}

export interface ChatResponse {
  sessionId: string;
  text: string;
  analysis: EAIAnalysis;
  mechanical: MechanicalState;
  auditId?: string | null;
}

export interface NudgeRequest {
  sessionId: string;
  level: number;
  profile: LearnerProfile;
  lastAnalysis: EAIAnalysis | null;
}

export interface AnalyticsSnapshot {
  activeSessions: number;
  totalMessages: number;
  avgLatencyMs: number;
  breachRate: number;
  updatedAt: number;
}