import React, { useState, useEffect } from 'react';
import { EAIAnalysis, MechanicalState, Message, DiagnosticResult } from '../types';
import { getEAICore, SSOTBand } from '../utils/ssotParser';
import { runDiagnostics } from '../utils/diagnostics';
import { EAIStateLike } from '../utils/eaiLearnAdapter';

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
      const base = "px-4 py-2 text-xs font-bold uppercase rounded transition-all border border-transparent";
      if (activeTab === mode) {
          if (mode === 'TELEMETRY') return `${base} bg-red-900/50 text-white border-red-500/30 shadow-[0_0_10px_rgba(220,38,38,0.3)]`;
          if (mode === 'HEALTH') return `${base} bg-green-900/50 text-white border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.3)]`;
          if (mode === 'PAPER') return `${base} bg-white/10 text-white border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)]`;
          if (mode === 'SSOT') return `${base} bg-cyan-900/50 text-white border-cyan-500/30`;
          return `${base} bg-cyan-700 text-white`;
      }
      return `${base} text-slate-500 hover:text-white hover:bg-white/5`;
  };

  const getBandDef = (code: string): SSOTBand | undefined => {
      for (const r of core.rubrics) {
          const band = r.bands.find(b => b.band_id === code);
          if (band) return band;
      }
      return undefined;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#050914] text-slate-300 font-mono flex flex-col animate-in zoom-in-95 duration-300">
      
      <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-900/50 bg-[#0b1120]">
        <div className="flex items-center gap-4">
            <div className={`w-3 h-3 ${lastMechanical?.logicGateBreach ? 'bg-red-500 animate-ping' : 'bg-green-500'} rounded-full shadow-[0_0_10px_currentColor]`}></div>
            <h1 className="text-lg font-bold text-white tracking-widest uppercase">EAI HUB CONSOLE v10.0</h1>
        </div>
        
        <div className="flex gap-2">
            <button onClick={() => setActiveTab('PAPER')} className={getTabClass('PAPER')}>Audit 5.0</button>
            <button onClick={() => setActiveTab('TRACE')} className={getTabClass('TRACE')}>Live Trace</button>
            <button onClick={() => setActiveTab('TELEMETRY')} className={getTabClass('TELEMETRY')}>Telemetry</button>
            <button onClick={() => setActiveTab('SSOT')} className={getTabClass('SSOT')}>SSOT Kernel</button>
            <button onClick={() => setActiveTab('HEALTH')} className={getTabClass('HEALTH')}>Sys Health</button>
        </div>

        <button onClick={onClose} className="text-xs border border-slate-700 px-3 py-1 rounded hover:bg-white/10">CLOSE</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide bg-gradient-to-br from-[#050914] to-[#0b1120]">
        
        {activeTab === 'TRACE' && (
             <div className="max-w-4xl mx-auto py-8 px-4 h-full flex flex-col">
                 <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Live Logic Stream</h2>
                        <p className="text-xs text-slate-400 font-mono mt-1">
                            REAL-TIME DECISION TREE MAPPED TO SSOT v{core.metadata.version}
                        </p>
                    </div>
                </div>

                {lastAnalysis ? (
                    <div className="space-y-6">
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

        {activeTab === 'PAPER' && (
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-8 space-y-8 animate-in slide-in-from-bottom-2 duration-500">
            <div className="border-l-4 border-green-500 pl-6 py-2 bg-gradient-to-r from-green-900/10 to-transparent">
                <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">AUDIT 5.0: THE HUB DEFENSE</h1>
                <div className="text-sm text-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Betreft</span>
                        <span className="text-white">Impact van Hub Architecture (v10) op Blinde Vlekken.</span>
                    </div>
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Status</span>
                        <span className="text-green-400">PARTIALLY MITIGATED</span>
                    </div>
                </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed border-b border-slate-800 pb-6">
                Met de introductie van de **EAI Hub (Orchestrator)** zijn de validatieregels verplaatst van de client naar de server. Dit rapport analyseert welke risico's nu zijn afgedekt (Secure) en welke fundamentele problemen blijven bestaan (Keyhole).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#051a10] p-5 rounded-xl border border-green-900/50 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-3 opacity-10">
                        <span className="text-4xl">🛡️</span>
                     </div>
                     <h3 className="text-green-400 font-bold uppercase text-xs tracking-wider mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                        1. Epistemische Cirkelredenering
                     </h3>
                     <div className="space-y-3">
                         <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest mb-1">
                             <span className="text-slate-500">Voorheen:</span>
                             <span className="text-red-400">CRITICAL</span>
                         </div>
                         <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest mb-1">
                             <span className="text-slate-500">Nu (Hub):</span>
                             <span className="text-green-400">CONTROLLED</span>
                         </div>
                         <div className="bg-black/40 p-3 rounded border border-green-500/20">
                             <div className="text-[10px] font-mono text-slate-300 mb-1">OPLOSSING:</div>
                             <p className="text-[10px] text-green-200 italic">
                                 De server-side <strong>Logic Gates</strong> blokkeren nu actief hallucinaties. Als de AI "Feit" claimt (E5) maar geen bron heeft, grijpt de Orchestrator in voordat de student het antwoord ziet.
                             </p>
                         </div>
                     </div>
                </div>

                <div className="bg-[#1a0505] p-5 rounded-xl border border-red-900/50 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-3 opacity-10">
                        <span className="text-4xl">🌫️</span>
                     </div>
                     <h3 className="text-red-400 font-bold uppercase text-xs tracking-wider mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                        2. Het Context Vacuüm
                     </h3>
                     <div className="space-y-3">
                         <p className="text-[11px] text-slate-400 leading-relaxed">
                            <strong>Status:</strong> De Hub weet nog steeds niet of de docent naast de leerling staat.
                         </p>
                         <div className="bg-black/40 p-3 rounded border border-red-500/20">
                             <div className="text-[10px] font-mono text-slate-300 mb-1">RISICO:</div>
                             <p className="text-[10px] text-red-200 italic">
                                 De AI kan 'samenwerken' (S4) adviseren terwijl de leerling alleen op zijn kamer zit. Dit is een "hard constraint" van tekst-only interfaces.
                             </p>
                         </div>
                     </div>
                </div>

                <div className="bg-[#1a1005] p-5 rounded-xl border border-orange-900/50 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-3 opacity-10">
                        <span className="text-4xl">🦜</span>
                     </div>
                     <h3 className="text-orange-400 font-bold uppercase text-xs tracking-wider mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                        3. De "Parrot" Val
                     </h3>
                     <div className="space-y-3">
                         <p className="text-[11px] text-slate-400 leading-relaxed">
                            <strong>Status:</strong> Verbeterd door Curriculum-koppeling.
                         </p>
                         <div className="bg-black/40 p-3 rounded border border-orange-500/20">
                             <div className="text-[10px] font-mono text-slate-300 mb-1">AANPAK:</div>
                             <p className="text-[10px] text-orange-200 italic">
                                 Doordat de Hub nu het <strong>Mastery Level</strong> bijhoudt, kan de AI zien: "Hé, je gebruikt termen uit niveau 5, maar je hebt niveau 1 nog niet gehaald." Dit triggert een 'Deepening Check' i.p.v. blind applaus.
                             </p>
                         </div>
                     </div>
                </div>

                <div className="bg-[#1a0505] p-5 rounded-xl border border-red-900/50 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-3 opacity-10">
                        <span className="text-4xl">😶</span>
                     </div>
                     <h3 className="text-red-400 font-bold uppercase text-xs tracking-wider mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                        4. De Non-Verbale Kloof
                     </h3>
                     <div className="space-y-3">
                         <p className="text-[11px] text-slate-400 leading-relaxed">
                            <strong>Status:</strong> Onoplosbaar in v10.0.
                         </p>
                         <div className="bg-black/40 p-3 rounded border border-red-500/20">
                             <div className="text-[10px] font-mono text-slate-300 mb-1">RISICO:</div>
                             <p className="text-[10px] text-red-200 italic">
                                 Frustratie, sarcasme of verveling worden gemist. De "Proactive Nudge" (Idle Timer) helpt bij stilte, maar kan irritant zijn als de leerling gewoon diep nadenkt.
                             </p>
                         </div>
                     </div>
                </div>
            </div>

             <div className="bg-gradient-to-br from-slate-900 to-[#0b1120] p-6 rounded-xl border border-slate-700 mt-8 relative overflow-hidden">
                <h3 className="text-white font-bold uppercase text-sm mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Conclusie Audit 5.0
                </h3>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                    De transitie naar de Hub-architectuur heeft de <strong>veiligheid</strong> en <strong>didactische integriteit</strong> drastisch verhoogd. We kunnen nu garanderen dat de AI zich aan de SSOT houdt (geen hallucinaties, geen didactische fouten). 
                    <br/><br/>
                    Echter, de <strong>menselijke component</strong> (emotie, context) blijft de achilleshiel. De docent blijft onmisbaar als 'sensor' voor de fysieke wereld.
                </p>
            </div>
            
            <div className="text-center pt-8 opacity-50">
                <p className="text-[9px] font-mono uppercase tracking-widest text-green-900">End of Audit Report 5.0</p>
            </div>
        </div>
        )}

        {activeTab === 'TELEMETRY' && (
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-xl relative overflow-hidden">
                    <h3 className="text-red-400 font-bold uppercase mb-6 text-sm tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        Mechanical Telemetry
                    </h3>
                    {lastMechanical ? (
                        <div className="space-y-4 text-xs font-mono relative z-10">
                            <div className="grid grid-cols-2 border-b border-white/5 pb-2">
                                <span className="text-slate-500 uppercase tracking-wide">Orchestrator Engine</span>
                                <span className="text-white font-bold text-right">{lastMechanical.model}</span>
                            </div>
                            <div className="grid grid-cols-2 border-b border-white/5 pb-2">
                                <span className="text-slate-500 uppercase tracking-wide">Latency (RTT)</span>
                                <span className={`font-bold text-right ${lastMechanical.latencyMs > 2000 ? 'text-orange-400' : 'text-green-400'}`}>{lastMechanical.latencyMs}ms</span>
                            </div>
                            <div className="grid grid-cols-2 border-b border-white/5 pb-2">
                                <span className="text-slate-500 uppercase tracking-wide">Logic Gate Status</span>
                                <span className={`font-bold text-right ${lastMechanical.logicGateBreach ? 'text-red-500 animate-pulse' : 'text-green-500'}`}>
                                    {lastMechanical.logicGateBreach ? 'BREACH DETECTED' : 'SECURE'}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-slate-500 italic">No telemetry data available.</div>
                    )}
                </div>

                <div className="bg-[#1a0505] border border-red-900/50 p-6 rounded-xl relative overflow-hidden">
                    <h3 className="text-orange-400 font-bold uppercase mb-4 text-sm tracking-wider">
                        Forensic Logic Log
                    </h3>
                    {lastMechanical?.logicGateBreach ? (
                         <div className="bg-black/50 border border-red-900/30 rounded p-3">
                             <div className="text-red-400 font-bold text-xs mb-1">CRITICAL BREACH</div>
                             <p className="text-[10px] text-slate-300 font-mono">
                                 {lastMechanical.logicGateBreach.rule_description}
                             </p>
                             <div className="mt-2 text-[9px] text-red-500 uppercase">
                                 Trigger: {lastMechanical.logicGateBreach.trigger_band}
                             </div>
                         </div>
                    ) : (
                        <div className="text-slate-600 text-xs italic">System operating within SSOT parameters.</div>
                    )}
                </div>
            </div>
        )}

        {activeTab === 'SSOT' && (
             <div className="max-w-6xl mx-auto">
                 <div className="mb-6 border-b border-slate-800 pb-4">
                    <h2 className="text-2xl font-bold text-white tracking-tight">SSOT Kernel v{core.metadata.version}</h2>
                    <p className="text-xs text-slate-400 font-mono mt-1">SINGLE SOURCE OF TRUTH</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {core.rubrics.map(r => (
                        <div key={r.rubric_id} className="bg-[#0f172a] border border-slate-700 rounded-xl p-4">
                            <h4 className="text-cyan-400 font-bold text-xs uppercase mb-2">{r.name}</h4>
                            <div className="space-y-1">
                                {r.bands.map(b => (
                                    <div key={b.band_id} className="flex justify-between text-[10px] border-b border-slate-800 pb-1 mb-1">
                                        <span className="text-white font-bold">{b.band_id}</span>
                                        <span className="text-slate-400 truncate ml-2">{b.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
             </div>
        )}

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

      </div>
    </div>
  );
};

export default TechReport;