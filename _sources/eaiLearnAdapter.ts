
import { getEAICore } from './ssotParser';
import type { EAIAnalysis, MechanicalState, LogicGateBreach, ScaffoldingState, SemanticValidation } from '../types';

export interface EAIBands {
    K?: string | null;
    P?: string | null;
    C?: string | null;
    TD?: string | null;
    V?: string | null;
    T?: string | null;
    E?: string | null;
    S?: string | null;
    L?: string | null;
    B?: string | null;
}

export interface EAIHistoryEntry {
    turn: number;
    bands: EAIBands;
    primary_band_id: string | null;
    srl_state: string | null;
    content_bands: string[];
    skill_bands: string[];
    timestamp: number;
    agency_score?: number; // Added for Phase 4
}

export interface EAIStateLike {
    turn_counter: number;
    current_bands: EAIBands;
    current_phase: string | null;
    srl_state: string | null;
    diagnostic_alert: string | null;
    active_fix: string | null;
    cognitive_mode: string | null;
    epistemic_status: string | null;
    history: EAIHistoryEntry[];
    mechanical: MechanicalState | null;
    scaffolding?: ScaffoldingState; // Phase 4
}

const CONTENT_DIMENSIONS = ['K', 'V', 'E', 'B', 'T'] as const;
const SKILL_DIMENSIONS = ['P', 'C', 'TD', 'S', 'L'] as const;

// Enhanced v15 fuzzy map
const COMMAND_FUZZY_MAP: Record<string, string> = {
    '/proces_evaluatie': '/proces_eval',
    '/fasecheck': '/fase_check',
    'fasecheck': '/fase_check',
    '/reflectie': '/meta',
    '/samenvatting': '/beurtvraag',
    '/quiz': '/quizgen',
    '/toets': '/quizgen',
    '/uitleg': '/beeld',
    '/voorbeelden': '/beeld',
    '/strategie': '/meta',
    'checkin': '/checkin',
    'devil': '/devil',
    'twist': '/twist',
    'vocab': '/vocab'
};

function extractDimensionFromBandId(bandId: string | null | undefined): string | null {
    if (!bandId) return null;

    // Format: K0, P3, TD4, C2
    const prefix = bandId.split('_')[0]; // Handle C_CoRegulatie_1 or C1
    const firstTwo = bandId.substring(0, 2);
    const firstOne = bandId.charAt(0);

    if (['P', 'C', 'V', 'T', 'E', 'S', 'L', 'B', 'K'].includes(prefix)) return prefix;
    if (bandId.startsWith('TD')) return 'TD';
    if (['P', 'C', 'V', 'T', 'E', 'S', 'L', 'B', 'K'].includes(firstOne)) return firstOne;

    return null;
}

/**
 * Phase 4: Calculate Agency Score from TD bands.
 * TD1 (Learner Dominant) = 100
 * TD2 = 80
 * TD3 (Shared) = 50
 * TD4 = 20
 * TD5 (AI Dominant) = 0
 */
function getAgencyScoreFromBands(bands: EAIBands): number {
    if (!bands.TD) return 50; // Default to shared
    const level = parseInt(bands.TD.replace('TD', ''), 10);
    if (isNaN(level)) return 50;
    
    // Map TD1..5 to 100..0
    const map = [0, 100, 80, 50, 20, 0];
    return map[level] !== undefined ? map[level] : 50;
}

/**
 * Phase 4: Analyze Trends
 */
export function calculateScaffoldingTrend(history: EAIHistoryEntry[], currentAgency: number): ScaffoldingState {
    // Get last 4 scores + current
    const recentHistory = history.slice(-4);
    const scores = [...recentHistory.map(h => h.agency_score || 50), currentAgency];
    
    // Calculate Trend
    let trend: 'RISING' | 'STABLE' | 'FALLING' = 'STABLE';
    if (scores.length >= 3) {
        const avgEarly = (scores[0] + scores[1]) / 2;
        const avgLate = (scores[scores.length-1] + scores[scores.length-2]) / 2;
        if (avgLate > avgEarly + 15) trend = 'RISING';
        else if (avgLate < avgEarly - 15) trend = 'FALLING';
    }

    // Generate Advice
    let advice = null;
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    if (scores.length >= 3) {
        if (avgScore < 30) {
            advice = "CRITICAL DEPENDENCY DETECTED. INITIATE FADING (FORCE TD2/TD3).";
        } else if (trend === 'FALLING' && avgScore < 50) {
             advice = "AGENCY DROPPING. REDUCE SUPPORT LEVEL.";
        } else if (trend === 'RISING' && avgScore > 80) {
            advice = "HIGH AGENCY. INCREASE COMPLEXITY (E4/S5).";
        }
    }

    return {
        agency_score: currentAgency,
        trend,
        advice,
        history_window: scores
    };
}

/**
 * Phase 5: Dynamic TTL Calculation
 * Calculates how long the system should wait before nudging, based on the last analysis.
 * Returns time in milliseconds.
 */
export function calculateDynamicTTL(analysis: EAIAnalysis | null): number {
    // Default baseline: 60 seconds
    let ttl = 60000; 

    if (!analysis) return ttl;

    // Extract bands
    const bands = [
        ...(analysis.process_phases || []),
        ...(analysis.coregulation_bands || []),
        ...(analysis.task_densities || []),
        ...(analysis.secondary_dimensions || [])
    ];

    const tdBand = bands.find(b => b.startsWith('TD'));
    const kBand = bands.find(b => b.startsWith('K'));

    // Rule 1: High Cognitive Load (Student Working) -> Increase Wait Time
    if (tdBand === 'TD1' || tdBand === 'TD2') {
        ttl += 60000; // Add 1 minute (Total 2 min)
    }

    // Rule 2: Metacognition (Deep Thinking) -> Increase Wait Time
    if (kBand === 'K3') {
        ttl += 45000; // Add 45s
    }

    // Rule 3: Low Agency / Drill / Instruction -> Decrease Wait Time
    if (tdBand === 'TD4' || tdBand === 'TD5') {
        ttl -= 20000; // Reduce by 20s (Total 40s) to keep flow
    }

    // Rule 4: Fact Recall -> Decrease Wait Time
    if (kBand === 'K1') {
        ttl -= 15000;
    }

    // Clamp limits: Min 30s, Max 3 mins
    return Math.max(30000, Math.min(180000, ttl));
}

/**
 * Phase 3: G-Factor Calculation (Semantic Integrity)
 * Calculates a 0.0-1.0 score representing the reliability of the analysis.
 */
export function calculateGFactor(analysis: EAIAnalysis): SemanticValidation {
    let score = 1.0;
    const penalties: string[] = [];

    // 1. Logic Gate Breaches (The Hardest Penalty)
    const breach = checkLogicGates(analysis);
    if (breach) {
        if (breach.priority === 'CRITICAL') {
            score -= 1.0; // Instant Fail
            penalties.push(`CRITICAL: Logic Gate Breach (${breach.trigger_band} violates ${breach.rule_description})`);
        } else {
            score -= 0.4;
            penalties.push(`HIGH: Logic Gate Breach (${breach.trigger_band})`);
        }
    }

    // 2. Alignment Mismatch (K-level vs Epistemic Status)
    const allBands = [
        ...(analysis.process_phases || []),
        ...(analysis.coregulation_bands || []),
        ...(analysis.task_densities || []),
        ...(analysis.secondary_dimensions || [])
    ];
    
    const kBand = allBands.find(b => b.startsWith('K'));
    const eBand = allBands.find(b => b.startsWith('E'));
    
    // K1 (Facts) should not have E4/E5 (Critical Falsification/Synthesis) usually
    if (kBand === 'K1' && (eBand === 'E4' || eBand === 'E5')) {
        score -= 0.2;
        penalties.push(`ALIGNMENT: Fact Retrieval (K1) mismatch with Critical Epistemics (${eBand})`);
    }

    // 3. Hallucination Risk (High Certainty without Grounding)
    if (analysis.epistemic_status === 'FEIT' && (!eBand || eBand === 'E0' || eBand === 'E1')) {
         score -= 0.3;
         penalties.push(`HALLUCINATION RISK: Claimed 'FEIT' without Verified Epistemic Band`);
    }

    // 4. Instructional Drift (P3 Instruction vs TD1 Learner Dominant)
    const pBand = allBands.find(b => b.startsWith('P'));
    const tdBand = allBands.find(b => b.startsWith('TD'));
    if (pBand === 'P3' && (tdBand === 'TD1' || tdBand === 'TD2')) {
        score -= 0.2;
        penalties.push(`DRIFT: Instruction Phase (P3) implies Teacher-Led, but Agency is High (${tdBand})`);
    }

    // Clamp score
    const finalScore = Math.max(0, Math.min(1, score));
    
    let status: 'OPTIMAL' | 'DRIFT' | 'CRITICAL' = 'OPTIMAL';
    if (finalScore < 0.5) status = 'CRITICAL';
    else if (finalScore < 0.9) status = 'DRIFT';

    return {
        gFactor: finalScore,
        penalties,
        alignment_status: status
    };
}

export function createInitialEAIState(): EAIStateLike {
    return {
        turn_counter: 0,
        current_bands: {},
        current_phase: null,
        srl_state: 'PLAN', // Standard start
        diagnostic_alert: null,
        active_fix: null,
        cognitive_mode: null,
        epistemic_status: null,
        history: [],
        mechanical: null,
    };
}

/**
 * Updates the EAI state based on the structured JSON output from the v15 Master.
 */
export function updateStateFromAnalysis(
    prev: EAIStateLike,
    analysis: EAIAnalysis,
    mechanical?: MechanicalState | null,
): EAIStateLike {
    const nextTurn = prev.turn_counter + 1;
    const nextBands: EAIBands = { ...prev.current_bands };

    // Helper to process a list of bands and assign them to dimensions
    const processBandList = (list: string[] | undefined) => {
        if (!list) return;
        list.forEach(bandId => {
            const dim = extractDimensionFromBandId(bandId);
            if (dim) (nextBands as any)[dim] = bandId;
        });
    };

    // Process all incoming band arrays from the Gemini Service
    processBandList(analysis.process_phases);
    processBandList(analysis.coregulation_bands);
    processBandList(analysis.task_densities);
    processBandList(analysis.secondary_dimensions);

    // Update Phase and SRL State
    const currentPhase = (nextBands.P) || prev.current_phase;
    const srlState = analysis.srl_state || prev.srl_state;

    // Identify primary band for history (Priority: K > P > TD > C)
    const primaryBand = nextBands.K || nextBands.P || nextBands.TD || nextBands.C || null;

    const contentBands: string[] = [];
    const skillBands: string[] = [];

    for (const [dim, bandId] of Object.entries(nextBands)) {
        if (!bandId) continue;
        if (CONTENT_DIMENSIONS.includes(dim as any)) contentBands.push(bandId as string);
        if (SKILL_DIMENSIONS.includes(dim as any)) skillBands.push(bandId as string);
    }
    
    // Phase 4: Calculate Agency
    const agencyScore = getAgencyScoreFromBands(nextBands);

    const historyEntry: EAIHistoryEntry = {
        turn: nextTurn,
        bands: nextBands,
        primary_band_id: primaryBand,
        srl_state: srlState,
        content_bands: contentBands,
        skill_bands: skillBands,
        timestamp: Date.now(),
        agency_score: agencyScore
    };
    
    // Phase 4: Calculate Trend for State
    const scaffolding = calculateScaffoldingTrend(prev.history, agencyScore);

    return {
        turn_counter: nextTurn,
        current_bands: nextBands,
        current_phase: currentPhase,
        srl_state: srlState,
        diagnostic_alert: null, 
        active_fix: analysis.active_fix ?? prev.active_fix ?? null,
        cognitive_mode: analysis.cognitive_mode ?? prev.cognitive_mode ?? null,
        epistemic_status: analysis.epistemic_status ?? prev.epistemic_status ?? null,
        history: [...prev.history, historyEntry],
        mechanical: mechanical ?? prev.mechanical ?? null,
        scaffolding: scaffolding // Store in state
    };
}

export interface SSOTValidationResult {
    ok: boolean;
    warnings: string[];
    healedAnalysis: EAIAnalysis;
    logicGateBreach?: LogicGateBreach;
}

/**
 * Phase 3: Logic Gate Enforcement - SSOT DYNAMIC LOADER
 * Updated to read gates directly from the SSOT Core instead of hardcoded IFs.
 */
export function checkLogicGates(analysis: EAIAnalysis): LogicGateBreach | undefined {
    const core = getEAICore();
    const gates = core.interaction_protocol?.logic_gates || [];

    // 1. Extract Current State into a lookup Set for speed
    const currentBands = new Set([
        ...(analysis.process_phases || []),
        ...(analysis.coregulation_bands || []),
        ...(analysis.task_densities || []),
        ...(analysis.secondary_dimensions || [])
    ]);

    // Find active TD band for comparison
    const activeTDBand = Array.from(currentBands).find(b => b.startsWith('TD'));
    if (!activeTDBand) return undefined;
    const tdLevel = parseInt(activeTDBand.replace('TD', ''), 10);
    if (isNaN(tdLevel)) return undefined;

    // 2. Dynamic Enforcement Loop
    for (const gate of gates) {
        // Is this gate active? (e.g. Is K1 present?)
        if (currentBands.has(gate.trigger_band)) {
            
            // Simple Parser for "MAX_TD = TD2" or "ALLOW_TD = TD4"
            // We expect the enforcement string in SSOT to match a pattern.
            // Current Pattern in SSOT: "MAX_TD = TD2..." or "ALLOW_TD = TD4..."
            
            let limit = 5;
            let operator: 'MAX' | 'ALLOW' = 'MAX';

            if (gate.enforcement.includes('MAX_TD = TD')) {
                const match = gate.enforcement.match(/MAX_TD\s*=\s*TD(\d)/);
                if (match) {
                    limit = parseInt(match[1], 10);
                    operator = 'MAX';
                }
            } else if (gate.enforcement.includes('ALLOW_TD = TD')) {
                const match = gate.enforcement.match(/ALLOW_TD\s*=\s*TD(\d)/);
                if (match) {
                    limit = parseInt(match[1], 10);
                    operator = 'ALLOW';
                }
            }

            // Check Violation
            if (operator === 'MAX') {
                if (tdLevel > limit) {
                    return {
                        trigger_band: gate.trigger_band,
                        rule_description: gate.enforcement, // Pass the full description for context
                        detected_value: activeTDBand,
                        priority: gate.priority
                    };
                }
            } else if (operator === 'ALLOW') {
                // ALLOW_TD = TD4 usually implies anything higher (TD5) is forbidden for this specific task
                // Context: Modeling (TD4) is allowed, but AI doing everything (TD5) might not be.
                // For simplicity, we treat ALLOW as a MAX limit for now.
                if (tdLevel > limit) {
                     return {
                        trigger_band: gate.trigger_band,
                        rule_description: gate.enforcement,
                        detected_value: activeTDBand,
                        priority: gate.priority
                    };
                }
            }
        }
    }

    return undefined;
}

/**
 * Validates and heals the analysis object against the v15 Master SSOT.
 */
export function validateAnalysisAgainstSSOT(analysis: EAIAnalysis, language: 'nl' | 'en' = 'nl'): SSOTValidationResult {
    const core = getEAICore();
    const knownBandIds = new Set<string>();
    const knownCommands = new Set<string>();
    const warnings: string[] = [];

    // Clone to avoid mutation of input reference
    const healed = JSON.parse(JSON.stringify(analysis));

    core.rubrics.forEach((rubric) => {
        (rubric.bands ?? []).forEach((band) => {
            if (band.band_id) knownBandIds.add(band.band_id);
        });
    });

    // Extract all commands from library
    core.commands.forEach(cmd => knownCommands.add(cmd.command));

    // Helper to validate and clean a specific list of bands
    const cleanBandList = (list: string[], fieldName: string) => {
        const clean: string[] = [];
        list.forEach(bandId => {
            if (knownBandIds.has(bandId)) {
                clean.push(bandId);
            } else if (bandId && bandId.length > 1) {
                // Soft warning for unknown bands
                warnings.push(`Pruned unknown band ID: ${bandId} in ${fieldName}`);
            }
        });
        return clean;
    };

    // Heal arrays
    healed.process_phases = cleanBandList(healed.process_phases || [], 'process_phases');
    healed.coregulation_bands = cleanBandList(healed.coregulation_bands || [], 'coregulation_bands');
    healed.task_densities = cleanBandList(healed.task_densities || [], 'task_densities');
    healed.secondary_dimensions = cleanBandList(healed.secondary_dimensions || [], 'secondary_dimensions');

    // Heal Commands (Active Fix)
    if (healed.active_fix && healed.active_fix !== 'NONE' && healed.active_fix !== 'null') {
        const fix = healed.active_fix.trim();

        if (!knownCommands.has(fix)) {
            if (COMMAND_FUZZY_MAP[fix]) {
                healed.active_fix = COMMAND_FUZZY_MAP[fix];
                warnings.push(`Healed command: '${fix}' -> '${healed.active_fix}'`);
            } else if (!fix.startsWith('/') && knownCommands.has(`/${fix}`)) {
                healed.active_fix = `/${fix}`;
                warnings.push(`Added missing prefix: '${fix}' -> '${healed.active_fix}'`);
            } else {
                warnings.push(`Nullified unknown command: '${fix}'`);
                healed.active_fix = null;
            }
        }
    } else {
        healed.active_fix = null;
    }

    // Validate SRL State
    const validSrl = ['PLAN', 'MONITOR', 'REFLECT', 'ADJUST', 'UNKNOWN'];
    if (healed.srl_state && !validSrl.includes(healed.srl_state)) {
        warnings.push(`Invalid SRL state: ${healed.srl_state}. Resetting to UNKNOWN.`);
        healed.srl_state = 'UNKNOWN';
    }

    // Check Logic Gates
    const gateBreach = checkLogicGates(healed);

    return {
        ok: true,
        warnings,
        healedAnalysis: healed,
        logicGateBreach: gateBreach
    };
}
