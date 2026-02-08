// CLIENT-SIDE ADMIN INTELLIGENCE
// Performs real-time introspection of the application state, SSOT integrity, and Local Storage.

import { getEAICore } from '../utils/ssotParser';
import { validateAnalysisAgainstSSOT } from '../utils/eaiLearnAdapter';
import { CURRICULUM_PATHS } from '../data/curriculum';
import { getOrCreateUserId } from './identity';

export type GovernanceMetric = {
    label: string;
    value: string | number;
    status: 'OK' | 'WARNING' | 'CRITICAL';
    trend?: 'up' | 'down' | 'neutral';
};

export type StorageItem = {
    key: string;
    size: number; // bytes
    type: 'PROFILE' | 'MASTERY' | 'SESSION' | 'SYSTEM' | 'UNKNOWN';
    value: any;
    isCorrupt: boolean;
    lastModified?: number; // Estimated
};

export type StorageStats = {
    usedBytes: number;
    keyCount: number;
    sessionsFound: number;
    profilesFound: number;
    corruptKeys: string[];
    quotaEstimate: number; // percent
};

export type BrowserEnv = {
    userAgent: string;
    language: string;
    platform: string;
    cookiesEnabled: boolean;
    screen: string;
    connection?: string;
    memory?: string;
    hardwareConcurrency: number;
};

export type RuntimeTelemetry = {
    isFallbackActive: boolean;
    apiKeyConfigured: boolean;
    logicEngineStatus: 'OPERATIONAL' | 'COMPROMISED';
    lastSelfTest: number;
};

export type SystemHealth = {
    version: string;
    integrityScore: number; // 0-100
    activeRubrics: number;
    activeCommands: number;
    activeGates: number;
    curriculumNodes: number;
    totalStudyTime: number;
    storage: StorageStats;
    telemetry: RuntimeTelemetry;
    browser: BrowserEnv;
    issues: string[];
};

const identifyKeyType = (key: string): StorageItem['type'] => {
    if (key.startsWith('eai_profile')) return 'PROFILE';
    if (key.startsWith('eai_mastery')) return 'MASTERY';
    if (key.startsWith('eai_user')) return 'SYSTEM';
    if (key.includes('sess_')) return 'SESSION';
    return 'UNKNOWN';
};

// Deep Browser Scan (Like F12)
const getBrowserEnv = (): BrowserEnv => {
    const nav = navigator as any;
    return {
        userAgent: nav.userAgent,
        language: nav.language,
        platform: nav.platform,
        cookiesEnabled: nav.cookieEnabled,
        screen: `${window.screen.width}x${window.screen.height} (${window.devicePixelRatio}x)`,
        connection: nav.connection ? `${nav.connection.effectiveType} (~${nav.connection.downlink}Mbps)` : 'Unknown',
        memory: nav.deviceMemory ? `~${nav.deviceMemory} GB RAM` : 'Unknown',
        hardwareConcurrency: nav.hardwareConcurrency || 0
    };
};

// Calculate Local Storage usage and find corrupt data
const analyzeStorage = (): StorageStats => {
    let usedBytes = 0;
    let keyCount = 0;
    let sessionsFound = 0;
    let profilesFound = 0;
    const corruptKeys: string[] = [];

    if (typeof localStorage !== 'undefined') {
        keyCount = localStorage.length;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i) || '';
            const val = localStorage.getItem(key) || '';
            usedBytes += key.length + val.length;

            if (key.startsWith('eai_profile')) {
                profilesFound++;
                try { JSON.parse(val); } catch { corruptKeys.push(key); }
            }
            if (key.includes('session') || key.includes('mastery')) {
                sessionsFound++;
                try { JSON.parse(val); } catch { corruptKeys.push(key); }
            }
        }
    }

    // Estimate generic 5MB limit for LS
    const quotaEstimate = (usedBytes / (5 * 1024 * 1024)) * 100;

    return { usedBytes, keyCount, sessionsFound, profilesFound, corruptKeys, quotaEstimate };
};

// NEW: Full Inspector Function
export const getStorageInspectorData = (): StorageItem[] => {
    const items: StorageItem[] = [];
    if (typeof localStorage === 'undefined') return [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) || '';
        const raw = localStorage.getItem(key) || '';
        let parsed = raw;
        let isCorrupt = false;

        try {
            parsed = JSON.parse(raw);
        } catch (e) {
            isCorrupt = true;
        }

        items.push({
            key,
            size: key.length + raw.length,
            type: identifyKeyType(key),
            value: parsed,
            isCorrupt
        });
    }
    return items.sort((a, b) => a.key.localeCompare(b.key));
};

export const deleteStorageItem = (key: string) => {
    localStorage.removeItem(key);
};

// Perform a Logic Integrity Test (Self-Test)
const runLogicSelfTest = (): 'OPERATIONAL' | 'COMPROMISED' => {
    try {
        const testPayload = {
            process_phases: ['UNKNOWN_PHASE_XYZ'], 
            task_densities: ['TD5'], 
            srl_state: 'INVALID_STATE',
            reasoning: 'Test',
            coregulation_bands: [],
            secondary_dimensions: [],
            active_fix: null,
            current_profile: { name: 'Test', subject: null, level: null, grade: null },
            task_density_balance: 50,
            epistemic_status: 'ONBEKEND',
            cognitive_mode: 'ONBEKEND',
            mastery_check: false
        };

        const result = validateAnalysisAgainstSSOT(testPayload as any);
        
        if (result.warnings.length > 0 && result.healedAnalysis.srl_state === 'UNKNOWN') {
            return 'OPERATIONAL';
        }
        return 'COMPROMISED';
    } catch (e) {
        console.error("Self Test Failed", e);
        return 'COMPROMISED';
    }
};

// Deep inspection of the SSOT and Curriculum
export const runSystemAudit = async (): Promise<SystemHealth> => {
    const core = getEAICore();
    const storage = analyzeStorage();
    const issues: string[] = [];

    const apiKey = process.env.API_KEY;
    const isFallbackActive = !apiKey || apiKey.length < 10 || apiKey.includes('YOUR_API_KEY');
    
    if (isFallbackActive) {
        issues.push("CRITICAL: API Key missing. System using MOCK inferencing.");
    }

    const logicStatus = runLogicSelfTest();
    if (logicStatus === 'COMPROMISED') {
        issues.push("CRITICAL: Logic Validator failed self-test. Code integrity compromised.");
    }

    let integrityScore = 100;
    if (isFallbackActive) integrityScore -= 40;
    if (logicStatus === 'COMPROMISED') integrityScore -= 50;
    
    const requiredDimensions = ['K', 'P', 'TD', 'C']; 
    const bands = core.rubrics.flatMap(r => r.bands.map(b => b.band_id));
    
    requiredDimensions.forEach(dim => {
        if (!bands.some(b => b.startsWith(dim))) {
            integrityScore -= 5;
            issues.push(`WARNING: Missing Dimension '${dim}' in SSOT.`);
        }
    });

    core.interaction_protocol?.logic_gates.forEach(gate => {
        if (!bands.includes(gate.trigger_band)) {
            integrityScore -= 5;
            issues.push(`WARNING: Logic Gate triggers on unknown band '${gate.trigger_band}'.`);
        }
    });

    if (storage.corruptKeys.length > 0) {
        integrityScore -= 10;
        issues.push(`WARNING: ${storage.corruptKeys.length} corrupt data keys found in local storage.`);
    }

    const totalNodes = CURRICULUM_PATHS.reduce((acc, path) => acc + path.nodes.length, 0);
    const totalMinutes = CURRICULUM_PATHS.reduce((acc, path) => acc + path.nodes.reduce((nAcc, n) => nAcc + (n.study_load_minutes || 0), 0), 0);

    if (totalNodes === 0) {
        issues.push("WARNING: Curriculum appears empty.");
    }

    const userId = getOrCreateUserId();
    if (!userId) issues.push("CRITICAL: Identity Service failed to resolve User ID.");

    return {
        version: core.metadata.version,
        integrityScore: Math.max(0, integrityScore),
        activeRubrics: core.rubrics.length,
        activeCommands: core.commands.length,
        activeGates: core.interaction_protocol?.logic_gates.length || 0,
        curriculumNodes: totalNodes,
        totalStudyTime: totalMinutes,
        storage,
        telemetry: {
            isFallbackActive,
            apiKeyConfigured: !isFallbackActive,
            logicEngineStatus: logicStatus,
            lastSelfTest: Date.now()
        },
        browser: getBrowserEnv(),
        issues
    };
};

// Admin Actions
export const performAdminAction = async (action: 'CLEAR_CACHE' | 'EXPORT_LOGS' | 'RESET_IDENTITY' | 'FIX_CORRUPTION') => {
    await new Promise(r => setTimeout(r, 800));

    switch (action) {
        case 'CLEAR_CACHE':
            localStorage.clear();
            return { success: true, message: "Local Storage flushed. Application state reset." };
        
        case 'RESET_IDENTITY':
            localStorage.removeItem('eai_user_id');
            localStorage.removeItem('eai_learner_profile');
            return { success: true, message: "User Identity revoked. New ID will be generated on reload." };

        case 'FIX_CORRUPTION':
            const storage = analyzeStorage();
            storage.corruptKeys.forEach(key => localStorage.removeItem(key));
            return { success: true, message: `Removed ${storage.corruptKeys.length} corrupt keys.` };

        case 'EXPORT_LOGS':
            const logs = {
                timestamp: new Date().toISOString(),
                system: await runSystemAudit(),
                userAgent: navigator.userAgent,
                storageDump: getStorageInspectorData() // Include raw data in logs
            };
            const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `eai_audit_${Date.now()}.json`;
            a.click();
            return { success: true, message: "Audit log exported to download." };
    }
};