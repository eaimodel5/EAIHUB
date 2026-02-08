
import { SSOT_DATA } from '../data/ssot';

// Define types for the parsed SSOT structure
export interface SSOTCommand {
  command: string;
  description: string;
}

export interface SSOTLogicGate {
    trigger_band: string;
    condition: string;
    enforcement: string; // e.g., "MAX_TD = TD2"
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export interface SSOTBand {
  band_id: string;
  label: string;
  description: string;
  fix?: string;
  fix_ref?: string; // Link to specific command
  // Extended intellectual content
  learner_obs?: string[];
  ai_obs?: string[];
  didactic_principle?: string;
  mechanistic?: {
      timescale: string;
      fast: number;
      mid: number;
      slow: number;
  };
  flag?: string; // Critical for Phase 3 diagnostics
}

export interface SSOTRubric {
  rubric_id: string;
  name: string;
  bands: SSOTBand[];
}

export interface SSOTStructure {
  commands: SSOTCommand[];
  rubrics: SSOTRubric[];
  cycleOrder: string[];
  metadata: {
    version: string;
    system: string;
  };
  // v13.0.0+ Architectural Fields
  context_model?: any;
  external_tools?: any;
  web_search_policy?: any;
  srl_model?: any;
  trace_schema?: any;
  interaction_protocol?: {
      logic_gates: SSOTLogicGate[];
  };
  didactic_diagnostics?: any;
}

// Internal cache
let cachedCore: SSOTStructure | null = null;

// The Parser Logic
const parseSSOT = (data: any): SSOTStructure => {
  try {
    const raw = data;
    
    // Extract Commands
    const commandsObj = raw.command_library?.commands || {};
    const commands: SSOTCommand[] = Object.entries(commandsObj).map(([cmd, desc]) => ({
      command: cmd,
      description: desc as string
    }));

    // Extract Rubrics
    const rubrics: SSOTRubric[] = (raw.rubrics || []).map((r: any) => ({
      rubric_id: r.rubric_id,
      name: r.name,
      bands: (r.bands || []).map((b: any) => ({
        band_id: b.band_id,
        label: b.label,
        description: b.description,
        fix: b.fix,
        fix_ref: b.fix_ref, // Passed through command reference
        // Extract deep pedagogical data
        learner_obs: b.learner_obs,
        ai_obs: b.ai_obs,
        didactic_principle: b.didactic_principle,
        mechanistic: b.mechanistic,
        flag: b.flag
      }))
    }));

    // Extract Cycle
    const cycleOrder = raw.metadata?.cycle?.order || [];

    // Extract Logic Gates (Phase 3 Integrity)
    const logic_gates: SSOTLogicGate[] = (raw.interaction_protocol?.logic_gates || []).map((g: any) => ({
        trigger_band: g.trigger_band,
        condition: g.condition,
        enforcement: g.enforcement,
        priority: g.priority
    }));

    return {
      commands,
      rubrics,
      cycleOrder,
      metadata: {
        version: raw.version,
        system: raw.metadata?.system
      },
      // Pass through new architectural fields
      context_model: raw.context_model,
      external_tools: raw.external_tools,
      web_search_policy: raw.web_search_policy,
      srl_model: raw.srl_model,
      trace_schema: raw.trace_schema,
      interaction_protocol: { logic_gates },
      didactic_diagnostics: raw.didactic_diagnostics
    };
  } catch (e) {
    console.error("CRITICAL: Failed to parse SSOT TS", e);
    return {
      commands: [],
      rubrics: [],
      cycleOrder: [],
      metadata: { version: '0.0.0', system: 'Error' }
    };
  }
};

// Dynamic Getter (Always NL)
export const getEAICore = (): SSOTStructure => {
    if (!cachedCore) cachedCore = parseSSOT(SSOT_DATA);
    return cachedCore;
};

// Legacy fallback
export const EAI_CORE = getEAICore();
