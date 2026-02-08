
import React, { useState, useEffect } from 'react';
import { EAIAnalysis, MechanicalState, Message, DiagnosticResult } from '../types';
import { getEAICore, SSOTBand } from '../utils/ssotParser';
import { runDiagnostics } from '../utils/diagnostics';
import { EAIStateLike, calculateDynamicTTL } from '../utils/eaiLearnAdapter';

interface TechReportProps {
  onClose: () => void;
  lastAnalysis: EAIAnalysis | null;
  lastMechanical: MechanicalState | null;
  messages: Message[];
  eaiState: EAIStateLike;
}

type TabMode = 'PAPER' | 'SSOT' | 'TRACE' | 'TELEMETRY' | 'HEALTH';

const TechReport: React.FC<TechReportProps> = ({ onClose, lastAnalysis, lastMechanical, messages, eaiState }) => {
  const [activeTab, setActiveTab] = useState<TabMode>('PAPER');
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const core = getEAICore();

  useEffect(() => {
      if (activeTab === 'HEALTH') {
          runDiagnostics(messages.length, lastMechanical?.latencyMs).then(setDiagnostics);
      }
  }, [activeTab, messages.length, lastMechanical]);

  const getTabClass = (mode: TabMode) => {
      const base = "px-4 py-3 sm:py-1 text-xs font-bold uppercase rounded transition-all whitespace-nowrap snap-center shrink-0 border border-transparent";
      if (activeTab === mode) {
          if (mode === 'TELEMETRY') {
              return `${base} bg-red-900/50 text-white border-red-500/30 shadow-[0_0_10px_rgba(220,38,38,0.3)]`;
          }
          if (mode === 'HEALTH') {
              return `${base} bg-green-900/50 text-white border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.3)]`;
          }
          if (mode === 'PAPER') {
              return `${base} bg-white/10 text-white border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)]`;
          }
          return `${base} bg-cyan-900/50 text-white border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.3)]`;
      }
      return `${base} text-slate-500 hover:text-white hover:bg-white/5`;
  };

  const attempts = lastMechanical?.repairAttempts || 0;
  const systemStatus = attempts > 0 
      ? { text: 'HEALED', color: 'text-orange-400', bg: 'bg-orange-500' }
      : { text: 'OPTIMAL', color: 'text-green-400', bg: 'bg-green-500' };

  // Helper to find SSOT definition from a code (e.g. C1)
  const getBandDef = (code: string): SSOTBand | undefined => {
      for (const r of core.rubrics) {
          const band = r.bands.find(b => b.band_id === code);
          if (band) return band;
      }
      return undefined;
  };

  // Helper to calculate visual breakdown of TTL
  const getTTLBreakdown = () => {
      if (!lastAnalysis) return null;
      
      const breakdown = [];
      let base = 60000;
      let total = 60000;

      const analysisBands = [
        ...(lastAnalysis.process_phases || []),
        ...(lastAnalysis.coregulation_bands || []),
        ...(lastAnalysis.task_densities || []),
        ...(lastAnalysis.secondary_dimensions || [])
      ];

      const tdBand = analysisBands.find(b => b.startsWith('TD'));
      const kBand = analysisBands.find(b => b.startsWith('K'));

      if (tdBand === 'TD1' || tdBand === 'TD2') {
          breakdown.push({ label: 'Deep Work (TD1/TD2)', mod: '+60s', type: 'good' });
          total += 60000;
      }
      if (kBand === 'K3') {
          breakdown.push({ label: 'Metacognition (K3)', mod: '+45s', type: 'good' });
          total += 45000;
      }
      if (tdBand === 'TD4' || tdBand === 'TD5') {
          breakdown.push({ label: 'Passive/Instruction (TD4/TD5)', mod: '-20s', type: 'bad' });
          total -= 20000;
      }
      if (kBand === 'K1') {
           breakdown.push({ label: 'Fact Recall (K1)', mod: '-15s', type: 'bad' });
           total -= 15000;
      }
      
      // Clamp logic matches eaiLearnAdapter
      const clamped = Math.max(30000, Math.min(180000, total));
      
      return { base, breakdown, total, clamped, isClamped: total !== clamped };
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#050914] text-slate-300 font-mono flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between px-4 sm:px-6 py-4 border-b border-cyan-900/50 bg-[#0b1120] shrink-0 gap-4 sm:gap-0">
        <div className="flex items-center justify-between sm:justify-start gap-6">
            <div className="flex items-center gap-3 shrink-0">
                <div className={`w-3 h-3 ${systemStatus.bg} rounded-full animate-pulse shadow-[0_0_10px_currentColor]`}></div>
                <div>
                    <h1 className="text-lg font-bold text-white tracking-widest uppercase truncate">EAI CONSOLE v9.0</h1>
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest">
                        <span className="text-cyan-500 hidden sm:inline">Engineering & Diagnostics</span>
                        <span className="text-slate-600 hidden sm:inline">|</span>
                        <span className={systemStatus.color}>SYS: {systemStatus.text}</span>
                    </div>
                </div>
            </div>
             <button onClick={onClose} className="sm:hidden text-xs uppercase tracking-wider text-slate-500 hover:text-white border border-slate-800 px-3 py-2 rounded">
                CLOSE
            </button>
        </div>
        
        <div className="relative -mx-4 sm:mx-0 px-4 sm:px-0">
            <div className="flex sm:bg-black/40 sm:rounded-lg sm:p-1 sm:border sm:border-white/5 overflow-x-auto scrollbar-hide gap-2 sm:gap-0 snap-x">
                <button onClick={() => setActiveTab('PAPER')} className={getTabClass('PAPER')}>Didactic Audit</button>
                <button onClick={() => setActiveTab('SSOT')} className={getTabClass('SSOT')}>SSOT Kernel</button>
                <button onClick={() => setActiveTab('TRACE')} className={getTabClass('TRACE')}>Live Trace</button>
                <button onClick={() => setActiveTab('TELEMETRY')} className={getTabClass('TELEMETRY')}>Telemetry</button>
                <button onClick={() => setActiveTab('HEALTH')} className={getTabClass('HEALTH')}>Sys Health</button>
            </div>
        </div>

        <button onClick={onClose} className="hidden sm:block text-xs uppercase tracking-wider text-slate-500 hover:text-cyan-400 transition-colors border border-slate-800 hover:border-cyan-500 px-3 py-1 rounded ml-4 shrink-0">
            CLOSE
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-0 scrollbar-hide relative bg-gradient-to-br from-[#050914] to-[#0b1120]">
        
        {/* === TAB: LIVE TRACE === */}
        {activeTab === 'TRACE' && (
             <div className="max-w-4xl mx-auto py-8 px-4 h-full flex flex-col">
                 <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Live Logic Stream</h2>
                        <p className="text-xs text-slate-400 font-mono mt-1">
                            REAL-TIME DECISION TREE MAPPED TO SSOT
                        </p>
                    </div>
                </div>

                {lastAnalysis ? (
                    <div className="space-y-6">
                        {/* 1. CLASSIFICATION BLOCK */}
                        <div className="bg-[#0f172a] border border-slate-700 rounded-xl overflow-hidden">
                             <div className="bg-slate-800/50 p-2 border-b border-slate-700 px-4 flex justify-between items-center">
                                 <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Phase 1: Classification</span>
                                 <span className="text-[10px] text-slate-500 font-mono">STEP 1/3</span>
                             </div>
                             <div className="p-4 space-y-4">
                                 {[
                                     ...(lastAnalysis.process_phases || []),
                                     ...(lastAnalysis.coregulation_bands || []),
                                     ...(lastAnalysis.task_densities || []),
                                     ...(lastAnalysis.secondary_dimensions || [])
                                 ].map(code => {
                                     const def = getBandDef(code);
                                     if (!def) return null;
                                     return (
                                         <div key={code} className="flex gap-4 p-3 bg-black/20 rounded border border-slate-800/50">
                                             <div className="w-10 text-center shrink-0">
                                                 <code className="text-xs font-bold text-cyan-300 bg-cyan-900/20 px-1.5 py-0.5 rounded border border-cyan-800">{code}</code>
                                             </div>
                                             <div className="flex-1">
                                                 <div className="flex justify-between items-start">
                                                     <h4 className="text-xs font-bold text-white">{def.label}</h4>
                                                     <span className="text-[9px] text-slate-500 uppercase">{def.didactic_principle}</span>
                                                 </div>
                                                 <div className="mt-2 text-[10px] space-y-1">
                                                     <div className="flex gap-2">
                                                         <span className="text-slate-500 uppercase font-bold min-w-[70px]">Diagnosis:</span>
                                                         <ul className="text-slate-300 list-disc pl-3">
                                                             {(def.learner_obs || []).map((o,i) => <li key={i}>{o}</li>)}
                                                         </ul>
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>
                                     );
                                 })}
                             </div>
                        </div>

                        {/* 2. REASONING BLOCK */}
                        <div className="bg-[#0f172a] border border-slate-700 rounded-xl overflow-hidden">
                             <div className="bg-slate-800/50 p-2 border-b border-slate-700 px-4 flex justify-between items-center">
                                 <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Phase 2: Reasoning Engine (CoT)</span>
                                 <span className="text-[10px] text-slate-500 font-mono">STEP 2/3</span>
                             </div>
                             <div className="p-4">
                                 <p className="font-mono text-xs text-purple-200 leading-relaxed whitespace-pre-wrap border-l-2 border-purple-500/30 pl-3">
                                     {lastAnalysis.reasoning}
                                 </p>
                             </div>
                        </div>

                        {/* 3. INTERVENTION BLOCK */}
                        <div className="bg-[#0f172a] border border-slate-700 rounded-xl overflow-hidden">
                             <div className="bg-slate-800/50 p-2 border-b border-slate-700 px-4 flex justify-between items-center">
                                 <span className="text-xs font-bold text-green-400 uppercase tracking-widest">Phase 3: Selected Intervention</span>
                                 <span className="text-[10px] text-slate-500 font-mono">STEP 3/3</span>
                             </div>
                             <div className="p-4">
                                 {lastAnalysis.active_fix ? (
                                     <div className="bg-green-900/10 border border-green-500/20 rounded p-3">
                                         <div className="flex items-center gap-2 mb-2">
                                             <code className="text-xs font-bold text-green-400 bg-green-900/30 px-2 py-0.5 rounded border border-green-500/30">
                                                 {lastAnalysis.active_fix}
                                             </code>
                                             <span className="text-xs text-white font-bold">
                                                  {core.commands.find(c => c.command === lastAnalysis.active_fix)?.description || "Dynamic Fix"}
                                             </span>
                                         </div>
                                         {[
                                             ...(lastAnalysis.process_phases || []),
                                             ...(lastAnalysis.coregulation_bands || []),
                                             ...(lastAnalysis.task_densities || []),
                                             ...(lastAnalysis.secondary_dimensions || [])
                                         ].map(code => {
                                             const def = getBandDef(code);
                                             if (def && def.fix) return (
                                                 <div key={code} className="text-[10px] text-slate-400 mt-1 pl-2 border-l-2 border-slate-700">
                                                     Derived from <strong>{code}</strong>: "{def.fix}"
                                                 </div>
                                             );
                                             return null;
                                         })}
                                     </div>
                                 ) : (
                                     <div className="text-xs text-slate-500 italic">No specific intervention protocol active.</div>
                                 )}
                             </div>
                        </div>

                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-600 border border-dashed border-slate-800 rounded-xl bg-black/20">
                        <p className="text-sm font-bold uppercase tracking-widest mb-2">System Idle</p>
                        <p className="text-xs">Start a conversation to capture logic traces.</p>
                    </div>
                )}
             </div>
        )}

        {/* === TAB: DIDACTIC AUDIT & BLIND SPOTS (REPLACES PAPER) === */}
        {activeTab === 'PAPER' && (
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-8 space-y-8 animate-in slide-in-from-bottom-2 duration-500">
            {/* 1. EXECUTIVE SUMMARY */}
            <div className="border-l-4 border-red-500 pl-6 py-2 bg-gradient-to-r from-red-900/10 to-transparent">
                <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">AUDIT 4.0: SYSTEMIC BLIND SPOTS</h1>
                <div className="text-sm text-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Betreft</span>
                        <span className="text-white">Analyse van wat de SSOT <u>niet</u> kan zien.</span>
                    </div>
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Status</span>
                        <span className="text-red-400">KEYHOLE PROBLEM DETECTED</span>
                    </div>
                </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed border-b border-slate-800 pb-6">
                De huidige architectuur (v15) bewaakt de <strong>logische consistentie</strong> (Butcher Paradox opgelost) en de <strong>didactische validiteit</strong> (Ruijssenaars/Vygotsky). Echter, de interactie blijft beperkt tot een 'Sleutelgat' (tekst-input). Dit rapport identificeert de 4 fundamentele blinde vlekken.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* BLIND SPOT 1: AFFECTIVE GAP */}
                <div className="bg-[#1a0505] p-5 rounded-xl border border-red-900/50 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="text-4xl">😶</span>
                     </div>
                     <h3 className="text-red-400 font-bold uppercase text-xs tracking-wider mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                        1. De Non-Verbale Kloof
                     </h3>
                     <div className="space-y-3">
                         <p className="text-[11px] text-slate-400 leading-relaxed">
                            <strong>Probleem:</strong> Tekst is emotioneel plat. Een leerling die "Oké" typt kan instemmen, sarcastisch zijn, of gefrustreerd afhaken.
                         </p>
                         <div className="bg-black/40 p-3 rounded border border-red-500/20">
                             <div className="text-[10px] font-mono text-slate-300 mb-1">RISICO:</div>
                             <p className="text-[10px] text-red-200 italic">
                                 De AI interpreteert stilte als "nadenken" (TD1/Wait Time), terwijl het "afhaken" kan zijn. De <code>idleTimer</code> is slechts een proxy, geen echte aandachtsmeting.
                             </p>
                         </div>
                     </div>
                </div>

                {/* BLIND SPOT 2: COGNITIVE MIMICRY */}
                <div className="bg-[#1a0505] p-5 rounded-xl border border-red-900/50 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="text-4xl">🦜</span>
                     </div>
                     <h3 className="text-orange-400 font-bold uppercase text-xs tracking-wider mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                        2. De "Parrot" Val
                     </h3>
                     <div className="space-y-3">
                         <p className="text-[11px] text-slate-400 leading-relaxed">
                            <strong>Probleem:</strong> De AI valideert de <em>tekst</em>, niet de <em>auteur</em>.
                         </p>
                         <div className="bg-black/40 p-3 rounded border border-orange-500/20">
                             <div className="text-[10px] font-mono text-slate-300 mb-1">RISICO:</div>
                             <p className="text-[10px] text-orange-200 italic">
                                 Een leerling die een Wikipedia-alinea kopieert, scoort hoog op Rubric K (Inhoud) en E (Epistemisch). Het systeem denkt: "Hoog niveau (K3/E4)", en schakelt onterecht over naar complexe coaching, terwijl de leerling niets heeft geleerd.
                             </p>
                         </div>
                     </div>
                </div>

                {/* BLIND SPOT 3: CONTEXT VOID */}
                <div className="bg-[#1a0505] p-5 rounded-xl border border-red-900/50 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="text-4xl">🌫️</span>
                     </div>
                     <h3 className="text-amber-400 font-bold uppercase text-xs tracking-wider mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                        3. Het Context Vacuüm
                     </h3>
                     <div className="space-y-3">
                         <p className="text-[11px] text-slate-400 leading-relaxed">
                            <strong>Probleem:</strong> De AI heeft geen weet van de fysieke wereld.
                         </p>
                         <div className="bg-black/40 p-3 rounded border border-amber-500/20">
                             <div className="text-[10px] font-mono text-slate-300 mb-1">RISICO:</div>
                             <p className="text-[10px] text-amber-200 italic">
                                 Staat de docent ernaast? Werkt de leerling in een groep? Is de bel gegaan? Rubric S (Sociaal) is een *inschatting* op basis van tekst, geen observatie van de realiteit.
                             </p>
                         </div>
                     </div>
                </div>

                {/* BLIND SPOT 4: EPISTEMIC BUBBLE */}
                <div className="bg-[#1a0505] p-5 rounded-xl border border-red-900/50 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="text-4xl">🔮</span>
                     </div>
                     <h3 className="text-pink-400 font-bold uppercase text-xs tracking-wider mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-pink-400 rounded-full"></span>
                        4. Epistemische Cirkelredenering
                     </h3>
                     <div className="space-y-3">
                         <p className="text-[11px] text-slate-400 leading-relaxed">
                            <strong>Probleem:</strong> De keurmeester (Logic Gate) gebruikt dezelfde 'waarheid' als de generator.
                         </p>
                         <div className="bg-black/40 p-3 rounded border border-pink-500/20">
                             <div className="text-[10px] font-mono text-slate-300 mb-1">RISICO:</div>
                             <p className="text-[10px] text-pink-200 italic">
                                 Als de SSOT of de training data een bias bevat (bijv. cultureel), zal de validatie deze bias <em>bevestigen</em> in plaats van corrigeren. De G-Factor meet consistentie, geen objectieve waarheid.
                             </p>
                         </div>
                     </div>
                </div>
            </div>

            {/* CONCLUSION */}
             <div className="bg-gradient-to-br from-slate-900 to-[#0b1120] p-6 rounded-xl border border-slate-700 mt-8 relative overflow-hidden">
                <h3 className="text-white font-bold uppercase text-sm mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    Conclusie: De Grens van de Machine
                </h3>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                    Ondanks de geavanceerde didactische architectuur (Ruijssenaars, Vygotsky, Zimmerman) en de strenge Logic Gates, blijft het systeem beperkt door de input-modaliteit (tekst). 
                    <br/><br/>
                    <strong>Mitigatie:</strong> De enige oplossing is de menselijke factor. De docent moet fungeren als de "fysieke API" die de emotie, context en authenticiteit bewaakt, terwijl de AI de cognitieve logistiek regelt. Zonder deze menselijke component blijft het systeem een zeer intelligente, maar autistische savant.
                </p>
            </div>
            
            <div className="text-center pt-8 opacity-50">
                <p className="text-[9px] font-mono uppercase tracking-widest text-red-900">End of Audit Report 4.0</p>
            </div>
        </div>
        )}

        {/* === TAB: SSOT KERNEL === */}
        {activeTab === 'SSOT' && (
             <div className="max-w-6xl mx-auto py-8 px-4">
                 <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">SSOT Kernel Visualization</h2>
                        <p className="text-xs text-slate-400 font-mono mt-1">
                            VERSION: {core.metadata.version}
                        </p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Rubrics Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4 border-b border-cyan-900 pb-2">Active Pedagogical Rubrics</h3>
                        {core.rubrics.map((rubric) => (
                            <div key={rubric.rubric_id} className="bg-[#0f172a] border border-slate-700 rounded-xl overflow-hidden">
                                <div className="bg-slate-800/50 p-3 border-b border-slate-700 flex justify-between items-center">
                                    <h4 className="text-sm font-bold text-white">{rubric.name}</h4>
                                    <code className="text-[10px] bg-black/30 px-2 py-0.5 rounded text-slate-400">{rubric.rubric_id}</code>
                                </div>
                                <div className="divide-y divide-slate-800">
                                    {rubric.bands.map(band => (
                                        <div key={band.band_id} className="p-4 hover:bg-white/5 transition-colors">
                                            <div className="flex items-center gap-2 mb-2">
                                                <code className="text-xs font-bold text-green-400 bg-green-900/20 px-1.5 py-0.5 rounded border border-green-900/30">{band.band_id}</code>
                                                <span className="text-xs font-bold text-white">{band.label}</span>
                                            </div>
                                            <p className="text-xs text-slate-400 mb-2">{band.description}</p>
                                            
                                            {/* Observation Logic Visualization */}
                                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] bg-black/30 p-2 rounded border border-white/5">
                                                <div>
                                                    <span className="text-slate-500 font-bold block mb-1 uppercase tracking-wider">Learner Obs (Diagnosis)</span>
                                                    <ul className="list-disc pl-3 text-slate-400 space-y-0.5">
                                                        {(band.learner_obs || []).length > 0 ? band.learner_obs?.map((obs, i) => <li key={i}>{obs}</li>) : <li className="italic opacity-50">None</li>}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <span className="text-slate-500 font-bold block mb-1 uppercase tracking-wider">AI Obs (Intervention)</span>
                                                    <ul className="list-disc pl-3 text-cyan-400/80 space-y-0.5">
                                                        {(band.ai_obs || []).length > 0 ? band.ai_obs?.map((obs, i) => <li key={i}>{obs}</li>) : <li className="italic opacity-50">None</li>}
                                                    </ul>
                                                </div>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Commands Column */}
                    <div>
                         <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4 border-b border-cyan-900 pb-2">Command Injection Matrix</h3>
                         <div className="bg-[#0f172a] border border-slate-700 rounded-xl overflow-hidden">
                             {core.commands.map((cmd) => (
                                 <div key={cmd.command} className="p-3 border-b border-slate-800 last:border-0 hover:bg-white/5 transition-colors">
                                     <div className="flex items-center justify-between mb-1">
                                         <code className="text-xs font-bold text-pink-400 bg-pink-900/20 px-1.5 py-0.5 rounded border border-pink-900/30">{cmd.command}</code>
                                     </div>
                                     <p className="text-[10px] text-slate-400 leading-relaxed">{cmd.description}</p>
                                 </div>
                             ))}
                         </div>
                    </div>
                </div>
             </div>
        )}

        {/* === TAB: HEALTH (Diagnostics) === */}
        {activeTab === 'HEALTH' && (
             <div className="max-w-4xl mx-auto py-8 px-4">
                 <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">System Health Check</h2>
                        <p className="text-xs text-slate-400 font-mono mt-1">
                            REAL-TIME DIAGNOSTICS // TIMESTAMP: {Date.now()}
                        </p>
                    </div>
                </div>

                <div className="grid gap-4">
                    {diagnostics.length === 0 && (
                        <div className="text-center py-10 text-slate-500 animate-pulse font-mono text-xs">Running system probe...</div>
                    )}
                    {diagnostics.map((res) => {
                        let styleClass = 'bg-[#1e0505] border-red-900/50 hover:bg-[#2e0808]';
                        let iconClass = 'bg-red-500/20 text-red-400';
                        let textClass = 'text-red-300';
                        let badgeClass = 'border-red-800 text-red-500 bg-red-900/30';

                        if (res.status === 'OK') {
                            styleClass = 'bg-[#061e16] border-green-900/50 hover:bg-[#0a2e22]';
                            iconClass = 'bg-green-500/20 text-green-400';
                            textClass = 'text-green-300';
                            badgeClass = 'border-green-800 text-green-500 bg-green-900/30';
                        } else if (res.status === 'WARNING') {
                            styleClass = 'bg-[#1e1505] border-orange-900/50 hover:bg-[#2e2108]';
                            iconClass = 'bg-orange-500/20 text-orange-400';
                            textClass = 'text-orange-300';
                            badgeClass = 'border-orange-800 text-orange-500 bg-orange-900/30';
                        }

                        return (
                            <div key={res.id} className={`p-4 rounded-lg border flex items-center justify-between transition-all duration-300 ${styleClass}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded flex items-center justify-center font-bold text-xs shrink-0 ${iconClass}`}>
                                        {res.category}
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-bold ${textClass}`}>{res.label}</h4>
                                        <p className="text-xs text-slate-400 font-mono mt-0.5">{res.message}</p>
                                    </div>
                                </div>
                                <div className={`text-[10px] font-bold px-2 py-1 rounded border tracking-wider shrink-0 ml-4 ${badgeClass}`}>
                                    {res.status}
                                </div>
                            </div>
                        );
                    })}
                </div>
             </div>
        )}

        {/* === TAB: TELEMETRY === */}
        {activeTab === 'TELEMETRY' && (
            <div className="p-4 sm:p-8 max-w-6xl mx-auto h-full flex flex-col min-h-[500px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Mechanical Stats */}
                    <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <svg className="w-24 h-24 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                        </div>
                        <h3 className="text-red-400 font-bold uppercase mb-6 text-sm tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            Mechanical Telemetry
                        </h3>
                        {lastMechanical ? (
                            <div className="space-y-4 text-xs font-mono relative z-10">
                                <div className="grid grid-cols-2 border-b border-white/5 pb-2">
                                    <span className="text-slate-500 uppercase tracking-wide">Inference Engine</span>
                                    <span className="text-white font-bold text-right">{lastMechanical.model}</span>
                                </div>
                                <div className="grid grid-cols-2 border-b border-white/5 pb-2">
                                    <span className="text-slate-500 uppercase tracking-wide">End-to-End Latency</span>
                                    <span className={`font-bold text-right ${lastMechanical.latencyMs > 2000 ? 'text-orange-400' : 'text-green-400'}`}>{lastMechanical.latencyMs}ms</span>
                                </div>
                                <div className="grid grid-cols-2 border-b border-white/5 pb-2">
                                    <span className="text-slate-500 uppercase tracking-wide">G-Factor (Semantic Integrity)</span>
                                    <span className={`font-bold text-right ${lastMechanical.semanticValidation?.alignment_status === 'CRITICAL' ? 'text-red-400' : (lastMechanical.semanticValidation?.alignment_status === 'DRIFT' ? 'text-amber-400' : 'text-emerald-400')}`}>
                                        {(lastMechanical.semanticValidation?.gFactor ?? 1.0) * 100}%
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 border-b border-white/5 pb-2">
                                    <span className="text-slate-500 uppercase tracking-wide">Self-Healing</span>
                                    <span className={`font-bold text-right ${(lastMechanical.repairAttempts || 0) > 0 ? 'text-orange-400' : 'text-slate-400'}`}>
                                        {(lastMechanical.repairAttempts || 0) > 0 ? `${lastMechanical.repairAttempts} REPAIR(S)` : '0 (CLEAN)'}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-40 text-slate-600 italic border border-dashed border-slate-800 rounded bg-black/20">
                                <span>No active telemetry stream.</span>
                                <span className="text-[10px] mt-2">Initiate chat session to capture data.</span>
                            </div>
                        )}
                    </div>

                    {/* NEW: TEMPORAL SCAFFOLDING (LIVE TTL VISUALIZER) */}
                    {(() => {
                        const breakdown = getTTLBreakdown();
                        return (
                        <div className="bg-[#1a1405] border border-yellow-900/50 p-6 rounded-xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-10">
                                <svg className="w-24 h-24 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                             </div>
                             <h3 className="text-yellow-400 font-bold uppercase mb-6 text-sm tracking-wider flex items-center gap-2">
                                <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                                Temporal Scaffolding (Live TTL)
                             </h3>
                             {breakdown ? (
                                 <div className="relative z-10 font-mono">
                                     <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Calculation Logic</div>
                                     <div className="bg-black/30 rounded p-3 border border-yellow-900/20 space-y-2 mb-4">
                                         <div className="flex justify-between text-xs text-slate-400">
                                             <span>Base System Latency</span>
                                             <span>60.0s</span>
                                         </div>
                                         {breakdown.breakdown.map((item, idx) => (
                                             <div key={idx} className={`flex justify-between text-xs font-bold ${item.type === 'good' ? 'text-green-400' : 'text-orange-400'}`}>
                                                 <span>{item.label}</span>
                                                 <span>{item.mod}</span>
                                             </div>
                                         ))}
                                         <div className="h-px bg-white/10 my-2"></div>
                                         <div className="flex justify-between text-sm font-bold text-white">
                                             <span>CALCULATED TTL</span>
                                             <span>{breakdown.total / 1000}s</span>
                                         </div>
                                         {breakdown.isClamped && (
                                              <div className="flex justify-between text-[10px] text-slate-500 italic">
                                                 <span>(Safety Clamped)</span>
                                                 <span>{breakdown.clamped / 1000}s</span>
                                             </div>
                                         )}
                                     </div>
                                     <div className="text-[10px] text-slate-500">
                                         * System will passively wait for <strong>{breakdown.clamped / 1000} seconds</strong> of silence before triggering a proactive didactic nudge.
                                     </div>
                                 </div>
                             ) : (
                                 <div className="flex flex-col items-center justify-center h-40 text-slate-600 italic border border-dashed border-yellow-900/30 rounded bg-black/20">
                                     <span>Awaiting didactic stream.</span>
                                 </div>
                             )}
                        </div>
                        );
                    })()}
                    
                    {/* FORENSIC BIOPSY - EXPLICIT SECTION FOR MOBILE/DESKTOP */}
                    <div className="bg-[#1a0505] border border-red-900/50 p-6 rounded-xl relative overflow-hidden flex flex-col md:col-span-2">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <svg className="w-24 h-24 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>
                        </div>
                        <h3 className="text-orange-400 font-bold uppercase mb-4 text-sm tracking-wider flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${lastMechanical?.repairLog ? 'bg-orange-500 animate-ping' : 'bg-slate-700'}`}></span>
                            Forensic Biopsy
                        </h3>

                        {lastMechanical?.repairLog ? (
                             <div className="flex-1 flex flex-col relative z-10">
                                 <div className="bg-black/50 border border-red-900/30 rounded p-3 mb-2">
                                     <div className="flex justify-between items-center mb-1">
                                         <span className="text-[10px] text-red-400 font-bold uppercase">Critical Event Detected</span>
                                         <span className="text-[10px] text-slate-500 font-mono">
                                             {new Date(lastMechanical.repairLog.timestamp).toLocaleTimeString()}
                                         </span>
                                     </div>
                                     <p className="text-[10px] text-red-300 font-mono break-words leading-relaxed border-l-2 border-red-600 pl-2">
                                         {lastMechanical.repairLog.error}
                                     </p>
                                 </div>
                                 
                                 <div className="flex-1 mt-2">
                                     <span className="text-[9px] text-slate-500 uppercase font-bold block mb-1">Raw Payload Dump</span>
                                     <div className="bg-[#050914] border border-slate-800 rounded p-2 overflow-x-auto">
                                         <pre className="text-[9px] text-slate-400 font-mono whitespace-pre-wrap break-all">
                                             {lastMechanical.repairLog.brokenPayload}
                                         </pre>
                                     </div>
                                 </div>
                             </div>
                        ) : (
                             <div className="flex flex-col items-center justify-center flex-1 text-slate-600 italic border border-dashed border-red-900/30 rounded bg-red-900/10 min-h-[120px]">
                                <span className="text-xs">No anomalies detected.</span>
                                <span className="text-[10px] mt-1 text-slate-700">System operating within SSOT parameters.</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default TechReport;
