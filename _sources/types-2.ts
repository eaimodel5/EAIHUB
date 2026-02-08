

export interface LearnerProfile {
  name: string | null;
  subject: string | null; // Vak
  level: string | null;   // Niveau (VWO, HAVO, etc.)
  grade: string | null;   // Leerjaar
  goal?: string | null;   // Persistent Learning Goal (Context Pinning)
}

export type CognitiveMode = 'ANALYTISCH' | 'REFLECTIEF' | 'SYSTEMISCH' | 'PRAGMATISCH' | 'CREATIEF' | 'NORMATIEF' | 'ONBEKEND';
export type SRLState = 'PLAN' | 'MONITOR' | 'REFLECT' | 'ADJUST' | 'UNKNOWN';

// --- PHASE 6: CURRICULUM ENGINE TYPES ---

export interface LearningNode {
    id: string;
    title: string;
    description: string;
    slo_ref: string; // Reference to official SLO Kerndoel/Eindterm
    didactic_focus: string; // The required SSOT Band (e.g. 'K1', 'P4', etc.)
    mastery_criteria: string; // Explicit instruction to AI what constitutes mastery
    example_question: string; // How the AI should probe this node
    
    // V4 LMS Expansion
    study_load_minutes?: number;
    prerequisite_ids?: string[];
    micro_steps?: string[];
    common_misconceptions?: string[];
}

export interface LearningPath {
    subject: string;
    level: string; // 'VMBO' | 'HAVO' | 'VWO'
    topic: string; // e.g. "Eiwitsynthese"
    nodes: LearningNode[];
}

export interface MasteryState {
    active_path_id: string | null; // e.g. "BIO_VWO_PROTEIN"
    current_node_index: number; // 0 = Start (A)
    status: 'INTRO' | 'WORKING' | 'CHECKING' | 'MASTERED';
    history: { node_index: number; timestamp: number }[];
}

// ----------------------------------------

export interface ScaffoldingState {
    agency_score: number; // 0-100 (100 = full student autonomy)
    trend: 'RISING' | 'STABLE' | 'FALLING';
    advice: string | null; // e.g. "INITIATE FADING"
    history_window: number[]; // Last 5 agency scores
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
  mastery_check?: boolean; // True if AI believes current node is mastered
}

export interface RepairLog {
  timestamp: number;
  error: string;
  brokenPayload: string;
}

export interface LogicGateBreach {
  trigger_band: string;     
  rule_description: string; 
  detected_value: string | null; 
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
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

export interface SemanticValidation {
    gFactor: number; 
    penalties: string[]; 
    alignment_status: 'OPTIMAL' | 'DRIFT' | 'CRITICAL';
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

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
  analysis?: EAIAnalysis;
  mechanical?: MechanicalState;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  showDashboard: boolean;
  currentAnalysis: EAIAnalysis | null;
  currentMechanical: MechanicalState | null;
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

// --- 10.0 Platform Types ---
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

export interface Assignment {
  id: string;
  classId?: string | null;
  studentId?: string | null;
  pathId: string;
  createdAt: number;
  dueAt?: number | null;
}

export interface ConsentRecord {
  userId: string;
  consentedAt: number;
  scopes: string[];
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
