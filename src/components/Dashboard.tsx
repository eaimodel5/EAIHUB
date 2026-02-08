import React, { useState, useEffect } from 'react';
import { EAIAnalysis, MechanicalState, LearnerProfile, MasteryStateV2 } from '../types';
import { getEAICore } from '../utils/ssotParser';
import type { EAIStateLike } from '../utils/eaiLearnAdapter';
import { getLearningPath } from '../data/curriculum';
import { fetchMastery } from '../services/masteryService';
import { getOrCreateUserId } from '../services/identity';

type Theme = {
    bg: string;
    sidebar: string;
    border: string;
    accent: string;
    accentText: string;
    buttonActive: string;
    bubbleUser: string;
    glow: string;
};

interface DashboardProps {
  analysis: EAIAnalysis | null;
  mechanical: MechanicalState | null;
  isOpen: boolean;
  onClose: () => void;
  theme: Theme; 
  isLoading?: boolean;
  profile?: LearnerProfile | null; 
  eaiState?: EAIStateLike | null;
  onEditProfile?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ analysis, mechanical, isOpen, onClose, theme, isLoading = false, profile, eaiState, onEditProfile }) => {
  
  const currentCore = getEAICore();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [masteryState, setMasteryState] = useState<MasteryStateV2 | null>(null);

  // Poll for mastery updates when dashboard opens or analysis changes
  useEffect(() => {
      if (isOpen && profile?.subject && profile?.level) {
          const path = getLearningPath(profile.subject, profile.level);
          if (path) {
              const activePathId = `${path.subject}_${path.level}`.toUpperCase().replace(/\s/g, '');
              const userId = getOrCreateUserId();
              fetchMastery(userId, activePathId).then(res => {
                  if (res && res.item) setMasteryState(res.item);
              }).catch(console.error);
          }
      }
  }, [isOpen, analysis, profile]);

  const getBandData = (prefix: string) => {
      if (!analysis) return null;
      const allCodes = [
          ...(analysis.process_phases || []),
          ...(analysis.coregulation_bands || []),
          ...(analysis.task_densities || []),
          ...(analysis.secondary_dimensions || []) 
      ];
      const foundCode = allCodes.find(c => {
          if (prefix === 'T') {
               return c.startsWith('T') && !c.startsWith('TD');
          }
          return c.startsWith(prefix);
      });
      if (!foundCode) return null;
      for (const rubric of currentCore.rubrics) {
          const band = rubric.bands.find(b => b.band_id === foundCode);
          if (band) return { id: foundCode, band, rubricName: rubric.name };
      }
      return { id: foundCode, band: null, rubricName: 'Unknown' };
  };

  const dimK = getBandData('K');
  const dimP = getBandData('P');
  const dimC = getBandData('C');
  const dimTD = getBandData('TD');
  const dimE = getBandData('E');
  const dimT = getBandData('T');

  const activeFixDetails = analysis?.active_fix 
    ? currentCore.commands.find(c => c.command === analysis.active_fix) 
    : null;
    
  const semVal = mechanical?.semanticValidation;

  // --- CURRICULUM VISUALIZATION DATA ---
  const activePath = getLearningPath(profile?.subject || '', profile?.level || '');
  
  const containerClasses = `
    fixed inset-y-0 right-0 w-full sm:w-96 bg-[#1e293b] border-l border-slate-700/50 
    z-[100] transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl
    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
  `;

  // Render a specific Dimension Card
  const renderDimCard = (label: string, data: ReturnType<typeof getBandData>, icon: React.ReactNode, key: string) => {
      const isActive = !!data;
      const bandId = data?.id || '-';
      const bandLabel = data?.band?.label || '...';
      const isExpanded = expandedCard === key;

      return (
          <div 
            onClick={() => isActive && setExpandedCard(isExpanded ? null : key)}
            className={`rounded-lg overflow-hidden mb-2 transition-all duration-300 ${isActive ? 'bg-slate-800 cursor-pointer hover:bg-slate-750' : 'bg-slate-800/40 opacity-50'}`}
          >
              <div className="p-3 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                      <span className="text-sm opacity-70 grayscale">{icon}</span>
                      <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">{label}</span>
                          <span className={`text-xs font-semibold ${isActive ? 'text-slate-200' : 'text-slate-600'}`}>{bandLabel}</span>
                      </div>
                  </div>
                  <div className="flex items-center gap-2">
                       <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded ${isActive ? 'bg-slate-900 text-slate-300' : 'bg-slate-900/50 text-slate-600'}`}>
                          {bandId}
                      </span>
                  </div>
              </div>
              {isActive && isExpanded && data?.band && (
                  <div className="bg-black/10 border-t border-white/5 p-3 text-[11px] space-y-3 animate-in fade-in slide-in-from-top-1">
                      <p className="text-slate-400 italic">"{data.band.description}"</p>
                      <div className="grid grid-cols-1 gap-2">
                          <div>
                              <span className="text-[9px] uppercase text-slate-500 font-bold block mb-0.5">Principe</span>
                              <span className="text-teal-400 font-medium">{data.band.didactic_principle || '-'}</span>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      );
  };

  return (
    <>
    {isOpen && <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[90] lg:hidden" onClick={onClose} />}
    <div className={containerClasses}>
      
      <div className="h-14 flex items-center justify-between px-6 bg-slate-800/50 shrink-0">
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-orange-400 animate-pulse' : (analysis ? 'bg-teal-500' : 'bg-slate-600')}`}></div>
            <span className={`text-xs font-bold tracking-widest uppercase ${isLoading ? 'text-orange-400' : 'text-slate-400'}`}>
                {isLoading ? 'SCANNING...' : 'EAI ONLINE'}
            </span>
        </div>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide space-y-8">
        
        {/* SECTION: PROFILE & CURRICULUM */}
        <div>
            <div className="flex justify-between items-baseline mb-3">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">CONTEXT & MASTERY</h3>
                {onEditProfile && <button onClick={onEditProfile} className="text-[9px] text-teal-500 hover:text-teal-400 font-bold uppercase">WIJZIG</button>}
            </div>
            
            <div className="bg-slate-800 rounded-xl p-4 space-y-4">
                <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-xs text-white font-medium">{profile?.name || '-'}</span>
                    <span className="text-xs text-teal-400 font-bold">{profile?.subject} {profile?.level}</span>
                </div>

                {/* CURRICULUM VISUALIZER */}
                {activePath ? (
                    <div>
                        <div className="flex justify-between items-center mb-2">
                             <span className="text-[10px] text-slate-400 uppercase tracking-wider">{activePath.topic}</span>
                             <span className="text-[9px] bg-teal-900/30 text-teal-400 px-1.5 py-0.5 rounded border border-teal-500/20">SLO</span>
                        </div>
                        <div className="space-y-3 relative">
                            {/* Connector Line */}
                            <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-700 z-0"></div>
                            
                            {activePath.nodes.map((node) => {
                                // Safe check for mastery
                                const isCurrent = masteryState?.currentNodeId === node.id;
                                const isMastered = masteryState?.history?.some(h => h.nodeId === node.id);
                                
                                return (
                                <div key={node.id} className="relative z-10 flex gap-3">
                                    <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                                        isMastered 
                                            ? 'bg-green-500 border-green-500' 
                                            : (isCurrent ? 'bg-slate-800 border-teal-500' : 'bg-slate-900 border-slate-700')
                                    }`}>
                                        {isMastered && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                        {isCurrent && !isMastered && <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></div>}
                                    </div>
                                    <div className={`pb-1 ${isCurrent ? 'opacity-100' : 'opacity-60'}`}>
                                        <div className={`text-xs font-bold ${isCurrent ? 'text-teal-400' : 'text-slate-300'}`}>{node.title}</div>
                                        <div className="text-[10px] text-slate-500 leading-tight">{node.didactic_focus}</div>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="text-xs text-slate-500 italic">Geen actieve leerlijn gedetecteerd.</div>
                )}
            </div>
        </div>
        
        {/* SECTION: G-FACTOR */}
        {semVal && (
            <div>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">INTEGRITEIT</h3>
                <div className="bg-slate-800 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-3">
                         <span className="text-xs text-slate-400">Betrouwbaarheid</span>
                         <span className={`text-xs font-bold ${semVal.alignment_status === 'CRITICAL' ? 'text-red-400' : 'text-teal-400'}`}>
                             {(semVal.gFactor * 100).toFixed(0)}%
                         </span>
                    </div>
                    <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                         <div 
                            className={`h-full transition-all duration-500 ${semVal.alignment_status === 'CRITICAL' ? 'bg-red-500' : 'bg-teal-500'}`}
                            style={{ width: `${semVal.gFactor * 100}%` }}
                         ></div>
                    </div>
                </div>
            </div>
        )}

        {/* SECTION: DIMENSIONS */}
        <div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">DIDACTISCHE DIMENSIES</h3>
            {renderDimCard('Kennis Type', dimK, '🧠', 'K')}
            {renderDimCard('Procesfase', dimP, '⏱️', 'P')}
            {renderDimCard('Co-Regulatie', dimC, '🤝', 'C')}
            {renderDimCard('Taakdichtheid', dimTD, '⚖️', 'TD')}
            {renderDimCard('Epistemisch', dimE, '🛡️', 'E')}
        </div>

        {/* SECTION: LOGIC */}
        <div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">REDENERING</h3>
            {analysis?.active_fix ? (
                <div className="bg-teal-900/10 border border-teal-500/20 rounded-xl p-4">
                    <span className="text-[9px] font-bold text-teal-500 uppercase block mb-1">Actieve Interventie</span>
                    <span className="text-sm font-mono text-white block mb-2">{analysis.active_fix}</span>
                    <p className="text-xs text-teal-200/80 leading-relaxed">{activeFixDetails ? activeFixDetails.description : '...'}</p>
                </div>
            ) : (
                <div className="bg-slate-800 rounded-xl p-4 text-center">
                    <span className="text-xs text-slate-500 italic">Geen interventie actief</span>
                </div>
            )}
            
            <div className="mt-3 p-4 bg-slate-800 rounded-xl">
                <span className="text-[9px] font-bold text-slate-500 uppercase block mb-2">Chain of Thought</span>
                <p className="text-[10px] text-slate-400 font-mono leading-relaxed border-l-2 border-slate-600 pl-3">
                    {analysis ? analysis.reasoning : 'Wachten op data...'}
                </p>
            </div>
        </div>

      </div>
    </div>
    </>
  );
};

export default Dashboard;