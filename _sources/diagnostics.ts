
import { getEAICore } from './ssotParser';
import { DiagnosticResult } from '../types';

/**
 * Helper: Estimate token count (rough approximation for client-side check)
 * 1 word ~= 1.3 tokens
 */
const estimateTokens = (text: string) => Math.ceil(text.length / 4);

export const runDiagnostics = async (
    historyCount: number, 
    lastLatency?: number
): Promise<DiagnosticResult[]> => {
    const results: DiagnosticResult[] = [];
    const timestamp = Date.now();

    // 1. ENVIRONMENT (Simplified - No Audio)
    results.push({
        id: 'ENV_MODE',
        category: 'ENV',
        label: 'Operation Mode',
        status: 'OK',
        message: 'Text-Only Mode Active (Audio Disabled in 9.0)',
        timestamp
    });

    // 2. MEMORY & CONTEXT PRESSURE (Real data)
    const estimatedContextLoad = historyCount * 150; // Rough avg per turn
    let memStatus: 'OK' | 'WARNING' | 'CRITICAL' = 'OK';
    if (estimatedContextLoad > 4000) memStatus = 'WARNING';
    if (estimatedContextLoad > 8000) memStatus = 'CRITICAL';

    results.push({
        id: 'SYS_CONTEXT',
        category: 'LOGIC',
        label: 'Context Window Pressure',
        status: memStatus,
        message: `Buffer: ${historyCount} turns (~${estimatedContextLoad} tokens). ${memStatus === 'OK' ? 'Optimal.' : 'High load, trimming advised.'}`,
        timestamp
    });

    // 3. LATENCY HEALTH
    if (lastLatency) {
        let latStatus: 'OK' | 'WARNING' | 'CRITICAL' = 'OK';
        if (lastLatency > 2000) latStatus = 'WARNING';
        if (lastLatency > 5000) latStatus = 'CRITICAL';
        
        results.push({
            id: 'SYS_LATENCY',
            category: 'ENV',
            label: 'Inference Latency',
            status: latStatus,
            message: `Last RTT: ${lastLatency}ms. ${latStatus === 'OK' ? 'Within tolerances.' : 'High latency detected.'}`,
            timestamp
        });
    }

    // 4. SSOT INTEGRITY CHECKS (Always NL)
    const core = getEAICore(); 
    const hasRubrics = core.rubrics.length > 0;
    
    // Check key architectural binds (v15)
    const requiredDimensions = ['K', 'P', 'TD', 'C', 'V', 'T', 'E', 'L', 'S', 'B'];
    const allBands = core.rubrics.flatMap(r => r.bands.map(b => b.band_id));
    const missingDims = requiredDimensions.filter(d => !allBands.some(b => b.startsWith(d)));

    if (missingDims.length === 0 && hasRubrics) {
        results.push({
            id: 'SSOT_INTEGRITY',
            category: 'SSOT',
            label: `Logic Kernel (NL)`,
            status: 'OK',
            message: `SSOT v${core.metadata.version} verified. Schema strictly enforced.`,
            timestamp
        });
    } else {
         results.push({
            id: 'SSOT_INTEGRITY',
            category: 'SSOT',
            label: `Logic Kernel (NL)`,
            status: 'CRITICAL',
            message: `Corrupt Schema. Missing dimensions: ${missingDims.join(', ')}`,
            timestamp
        });
    }

    return results;
};