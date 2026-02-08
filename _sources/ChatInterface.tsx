
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, EAIAnalysis, MechanicalState, LearnerProfile } from '../types';
import { sendMessageToGemini, resetChatSession, checkApiKeyConfigured, sendSystemNudge } from '../services/geminiService';
import { updateProfile } from '../services/profileService';
import { getOrCreateUserId } from '../services/identity';
import MessageBubble from './MessageBubble';
import Dashboard from './Dashboard';
import GameNeuroLinker from './GameNeuroLinker';
import ProfileSetup from './ProfileSetup';
import BootSequence from './BootSequence';
import TechReport from './TechReport';
import DidacticLegend from './DidacticLegend';
import {
  createInitialEAIState,
  updateStateFromAnalysis,
  EAIStateLike,
  calculateDynamicTTL
} from '../utils/eaiLearnAdapter';
import { getEAICore } from '../utils/ssotParser';

type Theme = { bg: string; sidebar: string; border: string; accent: string; accentText: string; buttonActive: string; bubbleUser: string; glow: string; };

// Updated Themes to be softer/matte
const THEMES: Record<string, Theme> = {
    DEFAULT: { bg: 'bg-[#0f172a]', sidebar: 'bg-[#1e293b]', border: 'border-slate-800', accent: 'bg-teal-600', accentText: 'text-teal-400', buttonActive: 'border-teal-500/50 bg-teal-500/10 text-teal-300', bubbleUser: 'bg-teal-900/20 text-teal-100', glow: 'shadow-none' },
    DEVIL: { bg: 'bg-[#1a1010]', sidebar: 'bg-[#251515]', border: 'border-red-900/30', accent: 'bg-red-700', accentText: 'text-red-400', buttonActive: 'border-red-500/30 bg-red-500/10 text-red-300', bubbleUser: 'bg-red-900/20 text-red-100', glow: 'shadow-none' },
    META: { bg: 'bg-[#13111c]', sidebar: 'bg-[#1c1929]', border: 'border-indigo-900/30', accent: 'bg-indigo-600', accentText: 'text-indigo-400', buttonActive: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300', bubbleUser: 'bg-indigo-900/20 text-indigo-100', glow: 'shadow-none' },
    CREATIVE: { bg: 'bg-[#151515]', sidebar: 'bg-[#202020]', border: 'border-fuchsia-900/30', accent: 'bg-fuchsia-700', accentText: 'text-fuchsia-400', buttonActive: 'border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300', bubbleUser: 'bg-fuchsia-900/20 text-fuchsia-100', glow: 'shadow-none' },
    COACH: { bg: 'bg-[#0c1612]', sidebar: 'bg-[#12211b]', border: 'border-emerald-900/30', accent: 'bg-emerald-700', accentText: 'text-emerald-400', buttonActive: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300', bubbleUser: 'bg-emerald-900/20 text-emerald-100', glow: 'shadow-none' },
    SYSTEM: { bg: 'bg-[#0e151a]', sidebar: 'bg-[#162026]', border: 'border-sky-900/30', accent: 'bg-sky-700', accentText: 'text-sky-400', buttonActive: 'border-sky-500/30 bg-sky-500/10 text-sky-300', bubbleUser: 'bg-sky-900/20 text-sky-100', glow: 'shadow-none' },
    PRAGMATIC: { bg: 'bg-[#17120e]', sidebar: 'bg-[#241c16]', border: 'border-orange-900/30', accent: 'bg-orange-700', accentText: 'text-orange-400', buttonActive: 'border-orange-500/30 bg-orange-500/10 text-orange-300', bubbleUser: 'bg-orange-900/20 text-orange-100', glow: 'shadow-none' }
};

const GET_TOOL_CATEGORIES = () => {
    return {
        START: [
            { label: "Bepaal doel", command: "/checkin", icon: "📍", desc: "Maak afspraken over doel en rol", mode: "COACH" },
            { label: "Kernvraag", command: "/leervraag", icon: "💡", desc: "Vind de kern van je leervraag", mode: "DEFAULT" },
            { label: "Proces check", command: "/fase_check", icon: "⏱️", desc: "Check waar je staat in het proces", mode: "SYSTEM" },
        ],
        UITLEG: [
            { label: "Structureer", command: "/schema", icon: "📐", desc: "Zet tekst om in structuur", mode: "SYSTEM" },
            { label: "Visualiseer", command: "/beeld", icon: "🎨", desc: "Krijg uitleg via een metafoor", mode: "CREATIVE" },
        ],
        UITDAGEN: [
            { label: "Devil's Advocate", command: "/devil", icon: "😈", desc: "Test je idee tegen kritiek", mode: "DEVIL" },
            { label: "Draai om", command: "/twist", icon: "🔄", desc: "Bekijk het van de andere kant", mode: "DEVIL" },
        ],
        CHECK: [
            { label: "Test mij", command: "/quizgen", icon: "📝", desc: "Test kennis met 3 vragen", mode: "COACH" },
            { label: "Samenvatten", command: "/beurtvraag", icon: "🎤", desc: "Vat samen in eigen woorden", mode: "PRAGMATIC" },
        ],
        REFLECTIE: [
            { label: "Helikopter", command: "/meta", icon: "🧠", desc: "Reflecteer op je aanpak", mode: "META" },
            { label: "Score zelf", command: "/rubric", icon: "📊", desc: "Beoordeel je eigen werk", mode: "SYSTEM" },
        ],
        PAUZE: [
            { label: "Neuro-Linker", command: "GAME_NEURO", icon: "💠", desc: "Reset je focus met een spel", mode: "DEFAULT" },
        ]
    };
};

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<string>(''); 
  const [activeMobileTab, setActiveMobileTab] = useState<'chat' | 'dashboard'>('chat');
  const [isDesktopDashboardOpen, setDesktopDashboardOpen] = useState(false);
  const [isToolboxOpen, setToolboxOpen] = useState(false); 
  const [activeToolTab, setActiveToolTab] = useState('START');
  
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES.DEFAULT);
  const [showGame, setShowGame] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(true);
  const [isBooting, setIsBooting] = useState(true);
  const [showTechReport, setShowTechReport] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  
  const [currentAnalysis, setCurrentAnalysis] = useState<EAIAnalysis | null>(null);
  const [currentMechanical, setCurrentMechanical] = useState<MechanicalState | null>(null);
  const [eaiState, setEaiState] = useState<EAIStateLike>(() => createInitialEAIState());
  const [isConnected, setIsConnected] = useState(true);
  const [hasApiKey, setHasApiKey] = useState(true);
  
  const [learnerProfile, setLearnerProfile] = useState<LearnerProfile>({ name: null, subject: null, level: null, grade: null, goal: null });
  const [ssotVersion, setSsotVersion] = useState('0.0.0');
  
  // Phase 5: Idle Timer Refs
  const lastInteractionRef = useRef<number>(Date.now());
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const analysisRef = useRef<EAIAnalysis | null>(null); 
  const nudgeLevelRef = useRef<number>(0); 
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setSsotVersion(getEAICore().metadata.version); }, []);
  useEffect(() => { setHasApiKey(checkApiKeyConfigured()); }, []);
  useEffect(() => { if (activeMobileTab === 'chat' || window.innerWidth >= 1024) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, activeMobileTab]);

  // Update refs for timer logic
  useEffect(() => { analysisRef.current = currentAnalysis; }, [currentAnalysis]);

  // --- PHASE 5: IDLE TIMER LOGIC ---
  const resetIdleTimer = useCallback(() => {
      if (idleTimerRef.current) {
          clearInterval(idleTimerRef.current);
          idleTimerRef.current = null;
      }
      
      // Start polling for idle state
      idleTimerRef.current = setInterval(() => {
          if (isLoading || isBooting || showProfileSetup) return; 
          
          if (nudgeLevelRef.current >= 3) return;

          const now = Date.now();
          const idleTime = now - lastInteractionRef.current;
          const dynamicTTL = calculateDynamicTTL(analysisRef.current);
          
          if (idleTime > dynamicTTL) {
               triggerProactiveNudge();
               lastInteractionRef.current = Date.now(); 
          }
      }, 5000); 
  }, [isLoading, isBooting, showProfileSetup]);

  useEffect(() => {
      resetIdleTimer();
      return () => { if (idleTimerRef.current) clearInterval(idleTimerRef.current); };
  }, [resetIdleTimer]);

  const triggerProactiveNudge = async () => {
      if (!analysisRef.current) return; 
      
      const nextLevel = nudgeLevelRef.current + 1;
      nudgeLevelRef.current = nextLevel; 

      setIsLoading(true);
      setLoadingStatus(`Nudge Level ${nextLevel}...`);
      
      try {
          const response = await sendSystemNudge(analysisRef.current, learnerProfile, nextLevel);
          
          const aiMessage: Message = { 
              id: (Date.now() + 1).toString(), 
              role: 'model', 
              text: response.text, 
              timestamp: new Date(), 
              analysis: response.analysis, 
              mechanical: response.mechanical 
          };
          
          setMessages(prev => [...prev, aiMessage]);
          setCurrentAnalysis(response.analysis);
          setCurrentMechanical(response.mechanical);
          setEaiState(prev => updateStateFromAnalysis(prev, response.analysis, response.mechanical));
      } catch (e) {
          console.error("Nudge failed", e);
      } finally {
          setIsLoading(false);
          setLoadingStatus('');
          lastInteractionRef.current = Date.now(); 
      }
  };

  const updateTheme = (command: string) => {
      const cleanCmd = (command || '').split(/[\s\n]/)[0];
      let newMode = 'DEFAULT';
      Object.values(GET_TOOL_CATEGORIES()).flat().forEach(t => { if (t.command === cleanCmd) newMode = t.mode; });
      setCurrentTheme(THEMES[newMode] || THEMES.DEFAULT);
  };

  const buildCommandMessage = (command: string): string => {
      return command;
  };

  const handleSendMessage = async (textOverride?: string) => {
    lastInteractionRef.current = Date.now();
    nudgeLevelRef.current = 0; 

    const isCommandClick = !!textOverride;
    let textToSend = textOverride || inputText;

    if (textToSend === 'GAME_NEURO') { setShowGame(true); setToolboxOpen(false); return; }
    if (!textToSend.trim() || isLoading) return;

    if (isCommandClick && textToSend.startsWith('/') && !textToSend.includes('\n')) {
        textToSend = buildCommandMessage(textToSend);
    }

    if (isCommandClick) {
        updateTheme(textToSend);
        setToolboxOpen(false); 
    }

    const userMessage: Message = { id: Date.now().toString(), role: 'user', text: textToSend, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setLoadingStatus('Denken...');

    try {
      const response = await sendMessageToGemini(
          userMessage.text, 
          (status) => setLoadingStatus(status),
          learnerProfile
      );
      
      const aiMessage: Message = { id: (Date.now() + 1).toString(), role: 'model', text: response.text, timestamp: new Date(), analysis: response.analysis, mechanical: response.mechanical };
      
      setMessages(prev => [...prev, aiMessage]);
      setCurrentAnalysis(response.analysis);
      setCurrentMechanical(response.mechanical);
      setIsConnected(true);
      setEaiState(prev => updateStateFromAnalysis(prev, response.analysis, response.mechanical));

      if (response.analysis.current_profile) {
          const newProf = response.analysis.current_profile;
          setLearnerProfile(prev => ({
              name: newProf.name || prev.name,
              subject: newProf.subject || prev.subject,
              level: newProf.level || prev.level,
              grade: newProf.grade || prev.grade,
              goal: newProf.goal || prev.goal 
          }));
      }

      if (response.analysis.active_fix) {
          updateTheme(response.analysis.active_fix);
      }

    } catch (error) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: "Failure", timestamp: new Date(), isError: true }]);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
      lastInteractionRef.current = Date.now(); 
    }
  };

  const toolCategories = GET_TOOL_CATEGORIES();
  const currentCategoryTools = (toolCategories as any)[activeToolTab] || [];

  return (
    <div className={`flex h-[100dvh] w-full ${currentTheme.bg} text-slate-200 overflow-hidden font-sans transition-colors duration-[1500ms] relative`}>
      
      {!hasApiKey && <div className="absolute top-0 left-0 right-0 z-[100] bg-red-600 text-white text-[10px] sm:text-xs font-bold uppercase py-2 animate-pulse text-center">⚠️ API KEY MISSING</div>}
      
      {isBooting && <BootSequence onComplete={() => setIsBooting(false)} />}
      
      <ProfileSetup 
            isOpen={!isBooting && showProfileSetup} 
            currentProfile={learnerProfile}
            onComplete={(p, g) => { 
                const fullProfile = { ...p, goal: g };
                setLearnerProfile(fullProfile); 
                setShowProfileSetup(false); 
                updateProfile(getOrCreateUserId(), fullProfile, ['profile', 'progress']).catch(() => undefined);
                
                if (messages.length === 0) {
                    handleSendMessage(g);
                }
            }} 
      />
      
      {showGame && <GameNeuroLinker onClose={() => setShowGame(false)} />}
      
      {showTechReport && <TechReport onClose={() => setShowTechReport(false)} lastAnalysis={currentAnalysis} lastMechanical={currentMechanical} messages={messages} eaiState={eaiState} />}
      <DidacticLegend isOpen={showLegend} onClose={() => setShowLegend(false)} />
      
      {/* DESKTOP SIDEBAR - CLEANER, FLATTER */}
      <div className={`hidden lg:flex w-64 flex-col ${currentTheme.sidebar} transition-colors duration-[1500ms] z-10 relative border-r ${currentTheme.border}`}>
        <div className="p-6">
             <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setShowTechReport(true)}>
                <div className={`w-8 h-8 rounded-lg ${currentTheme.accent} flex items-center justify-center text-white font-bold text-xs`}>
                    EAI
                </div>
                <span className="font-semibold text-slate-300 tracking-tight group-hover:text-white transition-colors">Studio 9.0</span>
             </div>
        </div>
        
        {/* Simplified Nav */}
        <div className="flex-1 flex flex-col justify-center items-center opacity-40 hover:opacity-100 transition-opacity duration-300">
            <div className="text-center cursor-pointer" onClick={() => setToolboxOpen(true)}>
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-400">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                </div>
                <span className="text-xs font-medium text-slate-500">Toolbox</span>
            </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4">
             <button 
                onClick={() => setDesktopDashboardOpen(!isDesktopDashboardOpen)}
                className={`w-full py-3 rounded-lg text-xs font-semibold tracking-wide flex items-center justify-between px-4 transition-all ${isDesktopDashboardOpen ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-slate-400'}`}
             >
                 <span>Dashboard</span>
                 <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-teal-500' : 'bg-red-500'}`}></div>
             </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className={`flex-1 flex flex-col h-full relative z-0 transition-all duration-300 ${isDesktopDashboardOpen ? 'lg:mr-96' : ''}`}>
        
        {/* Mobile Header */}
        <div className="h-14 flex items-center justify-between px-4 lg:hidden bg-slate-900/50 backdrop-blur-md z-20 shrink-0">
            <div className="font-bold text-teal-500" onClick={() => setShowTechReport(true)}>EAI STUDIO</div>
            <div className="flex items-center gap-4">
                 <button onClick={() => setShowLegend(true)} className="text-slate-400"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg></button>
                 <button onClick={() => setDesktopDashboardOpen(true)} className="text-slate-400"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg></button>
            </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
            <div className="max-w-3xl mx-auto min-h-full flex flex-col justify-end pb-4">
                {messages.length === 0 && !isBooting && !showProfileSetup && (
                    <div className="text-center text-slate-500 my-auto animate-in fade-in zoom-in duration-700">
                        <div className="w-12 h-12 bg-slate-800 rounded-2xl rotate-45 flex items-center justify-center mx-auto mb-6">
                            <span className="-rotate-45 text-xl">💠</span>
                        </div>
                        <p className="text-sm font-medium tracking-wide">EAI Core Active</p>
                    </div>
                )}
                
                {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} themeClasses={currentTheme.bubbleUser} />
                ))}
                
                {isLoading && (
                     <div className="flex items-center gap-2 text-slate-500 text-xs px-4 py-2 animate-pulse">
                         <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                         <span className="font-medium tracking-wide opacity-70">
                             {loadingStatus || 'Aan het denken...'}
                         </span>
                     </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>

        {/* Desktop Floating Actions */}
        <div className="absolute top-6 right-6 hidden lg:flex flex-col gap-3 z-10">
            <button onClick={() => setShowLegend(true)} className="w-8 h-8 flex items-center justify-center bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-all" title="Uitleg">
                <span className="font-serif font-bold text-xs">i</span>
            </button>
             <button onClick={resetChatSession} className="w-8 h-8 flex items-center justify-center bg-slate-800/50 hover:bg-red-900/50 text-slate-400 hover:text-red-400 rounded-full transition-all" title="Reset">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
            </button>
        </div>

        {/* Input Area - Floating & Cleaner */}
        <div className="p-4 sm:p-6 z-20">
            <div className="max-w-3xl mx-auto relative flex gap-3 items-end">
                <button onClick={() => setToolboxOpen(!isToolboxOpen)} className="p-3 rounded-full bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
                </button>
                <div className="flex-1 bg-slate-800/80 rounded-3xl flex items-center p-1.5 shadow-lg shadow-black/10 focus-within:ring-2 focus-within:ring-teal-500/30 transition-all backdrop-blur-sm">
                    <textarea
                        value={inputText}
                        onChange={(e) => {
                            setInputText(e.target.value);
                            lastInteractionRef.current = Date.now();
                            nudgeLevelRef.current = 0;
                        }}
                        onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}}
                        placeholder="Typ een bericht..."
                        className="flex-1 bg-transparent border-none text-slate-200 px-4 py-3 max-h-32 min-h-[48px] focus:ring-0 resize-none placeholder-slate-500 scrollbar-hide text-[16px]"
                        rows={1}
                    />
                    <button onClick={() => handleSendMessage()} disabled={!inputText.trim()} className={`p-3 rounded-full transition-all duration-300 ${inputText.trim() ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20 hover:bg-teal-500' : 'bg-transparent text-slate-600'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>
                    </button>
                </div>
            </div>
        </div>
      </div>

      <Dashboard 
            analysis={currentAnalysis} 
            mechanical={currentMechanical} 
            isOpen={isDesktopDashboardOpen} 
            onClose={() => setDesktopDashboardOpen(false)} 
            theme={currentTheme} 
            isLoading={isLoading} 
            profile={learnerProfile} 
            eaiState={eaiState}
            onEditProfile={() => setShowProfileSetup(true)}
      />

      {isToolboxOpen && (
          <div className="fixed inset-0 z-50">
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" onClick={() => setToolboxOpen(false)}></div>
              <div className="absolute bottom-0 left-0 right-0 lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:bottom-auto lg:w-[640px] lg:rounded-3xl bg-[#1e293b] border border-slate-700/50 rounded-t-3xl p-6 max-h-[70vh] lg:max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom-20 lg:zoom-in-95 lg:slide-in-from-bottom-0 duration-300 shadow-2xl">
                  <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-6 lg:hidden"></div>
                  <div className="flex justify-between items-center mb-6">
                       <h2 className="text-xl font-light text-white tracking-wide">Intervention Toolbox</h2>
                       <button onClick={() => setToolboxOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-slate-400"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide snap-x">
                       {Object.keys(toolCategories).map((cat) => (
                           <button key={cat} onClick={() => setActiveToolTab(cat)} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border snap-center ${activeToolTab === cat ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' : 'bg-transparent text-slate-500 border-transparent hover:bg-slate-800'}`}>{cat}</button>
                       ))}
                  </div>
                  <div key={activeToolTab} className="animate-in fade-in slide-in-from-right-2 duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {currentCategoryTools.map((tool: any) => (
                            <button key={tool.command} onClick={() => handleSendMessage(tool.command)} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-teal-500/30 transition-all active:scale-[0.98] group text-left">
                                <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform duration-300 filter grayscale group-hover:grayscale-0">{tool.icon}</span>
                                <div className="min-w-0">
                                    <div className="text-sm font-semibold text-slate-200 group-hover:text-teal-400 transition-colors">{tool.label}</div>
                                    <div className="text-xs text-slate-500 truncate mt-0.5">{tool.desc}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default ChatInterface;
