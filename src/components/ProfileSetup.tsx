import React, { useState, useEffect } from 'react';
import { LearnerProfile } from '../types';

interface ProfileSetupProps {
  onComplete: (profile: LearnerProfile, goal: string) => void;
  isOpen: boolean;
  currentProfile?: LearnerProfile;
}

export const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete, isOpen, currentProfile }) => {
  // Steps: 1=Name, 2=Level, 3=Subject, 4=Grade, 5=Goal
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<LearnerProfile>({
    name: '',
    subject: '',
    level: '',
    grade: ''
  });
  const [customSubject, setCustomSubject] = useState('');
  const [goal, setGoal] = useState('');
  const [isFading, setIsFading] = useState(false);

  const t = {
      step1_title: "Welkom bij EAI Studio.",
      step1_sub: "Laten we beginnen met je naam.",
      step2_title: "Kies je niveau.",
      step2_sub: "Selecteer je onderwijsniveau om te starten.",
      step3_title: "Kies je vak.",
      step3_sub: "Selecteer een module of typ een ander vak.",
      step4_title: "Welk leerjaar?",
      step4_sub: "Dit helpt de AI het juiste abstractieniveau te kiezen.",
      step5_title: "Je startpunt.",
      step5_sub: "Omschrijf kort wat je al weet over dit onderwerp.",
  };

  useEffect(() => {
    if (isOpen && currentProfile) {
        setFormData(prev => ({
            ...prev,
            name: currentProfile.name || '',
            subject: currentProfile.subject || '',
            level: currentProfile.level || '',
            grade: currentProfile.grade || ''
        }));
    }
  }, [isOpen, currentProfile]);

  const handleStepChange = (nextStep: number) => {
      setIsFading(true);
      setTimeout(() => {
          setStep(nextStep);
          setIsFading(false);
      }, 300);
  };

  const goNext = (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      // Logic checks before proceeding
      if (step === 3 && !formData.subject && !customSubject) return; // Block empty subject
      if (step === 3 && customSubject) {
          setFormData(prev => ({ ...prev, subject: customSubject }));
      }

      if (step < 5) handleStepChange(step + 1);
      else handleSubmit();
  };

  const goBack = () => {
      if (step > 1) handleStepChange(step - 1);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onComplete(formData, goal || "Ik start met de module.");
  };

  const handleGuest = () => {
      const guestProfile: LearnerProfile = {
          name: 'Gastgebruiker',
          subject: 'Algemeen',
          level: 'Algemeen',
          grade: 'N/A'
      };
      onComplete(guestProfile, "Ik verken de applicatie.");
  };

  const handleLevelSelect = (level: string) => {
      setFormData(prev => ({ ...prev, level }));
      handleStepChange(3);
  };

  const handlePresetSubjectSelect = (subject: string) => {
      setFormData(prev => ({ ...prev, subject }));
      handleStepChange(4);
  };

  const handleGradeSelect = (grade: string) => {
      setFormData(prev => ({ ...prev, grade }));
      handleStepChange(5);
  };

  const getGradeOptions = () => {
      return ['Klas 1', 'Klas 2', 'Klas 3', 'Klas 4', 'Klas 5', 'Klas 6'];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0f172a] text-slate-200 font-sans transition-all duration-700">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-800/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* ESCAPE HATCH BUTTON */}
      <button 
        onClick={handleGuest} 
        className="absolute top-6 right-6 sm:top-8 sm:right-8 z-20 group flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 hover:bg-white/10 transition-all text-slate-400 hover:text-white"
      >
        <span className="text-xs uppercase tracking-widest font-bold">Doorgaan als Gast</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </button>

      <div className="w-full max-w-4xl px-4 sm:px-8 relative z-10">
            {/* PROGRESS INDICATOR */}
            <div className="flex justify-center gap-3 mb-12">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${i === step ? 'bg-teal-400 scale-125' : 'bg-slate-700'}`}></div>
                ))}
            </div>

            <form onSubmit={step === 5 ? handleSubmit : goNext} className={`transition-opacity duration-300 ${isFading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                <div className="min-h-[400px] flex flex-col items-center w-full">
                    
                    {/* --- STEP 1: NAME --- */}
                    {step === 1 && (
                        <div className="w-full text-center">
                            <h2 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-tight">{t.step1_title}</h2>
                            <p className="text-slate-400 mb-10 text-lg">{t.step1_sub}</p>
                            <input 
                                type="text" 
                                autoFocus
                                required
                                value={formData.name || ''}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                className="w-full max-w-md bg-transparent border-b border-slate-600 px-2 py-4 text-2xl text-center text-white placeholder-slate-700 focus:border-teal-500 focus:outline-none transition-colors mx-auto block"
                                placeholder="Typ je naam..."
                            />
                        </div>
                    )}

                    {/* --- STEP 2: LEVEL SELECTION --- */}
                    {step === 2 && (
                        <div className="w-full max-w-3xl text-center">
                            <h2 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-tight">{t.step2_title}</h2>
                            <p className="text-slate-400 mb-12 text-lg">{t.step2_sub}</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {['VMBO', 'HAVO', 'VWO'].map(lvl => (
                                    <button
                                        key={lvl}
                                        type="button"
                                        onClick={() => handleLevelSelect(lvl)}
                                        className="group relative p-8 rounded-2xl border border-slate-700 bg-slate-800/40 hover:bg-slate-800 hover:border-teal-500 transition-all duration-300 active:scale-95 flex flex-col items-center justify-center min-h-[180px]"
                                    >
                                        <div className="text-3xl font-bold text-slate-300 group-hover:text-white mb-2">{lvl}</div>
                                        <div className="text-[10px] text-slate-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity text-teal-400">Selecteer</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- STEP 3: SUBJECT SELECTION (CONDITIONAL) --- */}
                    {step === 3 && (
                        <div className="w-full max-w-3xl text-center">
                            <h2 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-tight">{t.step3_title}</h2>
                            <p className="text-slate-400 mb-8 text-lg">
                                {formData.level === 'VMBO' ? "Welk vak wil je oefenen?" : t.step3_sub}
                            </p>

                            <div className="bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50 inline-block mb-10">
                                <span className="text-xs text-slate-500 uppercase tracking-widest mr-2">Niveau:</span>
                                <span className="text-sm font-bold text-white">{formData.level}</span>
                            </div>
                            
                            {/* VWO OPTIONS */}
                            {formData.level === 'VWO' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                    <button type="button" onClick={() => handlePresetSubjectSelect('Biologie')} className="p-6 rounded-xl border border-teal-500/30 bg-teal-900/10 hover:bg-teal-900/20 hover:border-teal-500 transition-all text-left group">
                                        <div className="text-2xl mb-2">🧬</div>
                                        <div className="font-bold text-white text-lg">Biologie</div>
                                        <div className="text-xs text-teal-400 mt-1">Module: Eiwitsynthese</div>
                                    </button>
                                    <button type="button" onClick={() => handlePresetSubjectSelect('Wiskunde B')} className="p-6 rounded-xl border border-teal-500/30 bg-teal-900/10 hover:bg-teal-900/20 hover:border-teal-500 transition-all text-left group">
                                        <div className="text-2xl mb-2">📐</div>
                                        <div className="font-bold text-white text-lg">Wiskunde B</div>
                                        <div className="text-xs text-teal-400 mt-1">Module: Differentiëren</div>
                                    </button>
                                </div>
                            )}

                            {/* HAVO OPTIONS */}
                            {formData.level === 'HAVO' && (
                                <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 mb-8 max-w-sm mx-auto">
                                    <button type="button" onClick={() => handlePresetSubjectSelect('Economie')} className="p-6 rounded-xl border border-teal-500/30 bg-teal-900/10 hover:bg-teal-900/20 hover:border-teal-500 transition-all text-left group">
                                        <div className="text-2xl mb-2">💰</div>
                                        <div className="font-bold text-white text-lg">Economie</div>
                                        <div className="text-xs text-teal-400 mt-1">Module: Marktwerking</div>
                                    </button>
                                </div>
                            )}

                            {/* GENERIC INPUT (ALWAYS VISIBLE BUT STYLED DIFFERENTLY FOR VMBO) */}
                            <div className={`w-full max-w-md mx-auto ${formData.level === 'VMBO' ? '' : 'border-t border-white/10 pt-8'}`}>
                                <p className="text-xs text-slate-500 uppercase tracking-widest mb-4 text-center">
                                    {formData.level === 'VMBO' ? "Typ hier je vak" : "Of typ een ander vak"}
                                </p>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={customSubject}
                                        onChange={e => setCustomSubject(e.target.value)}
                                        onKeyDown={e => { if(e.key === 'Enter' && customSubject) goNext(); }}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-4 text-white placeholder-slate-600 focus:border-teal-500 focus:outline-none transition-colors pr-12"
                                        placeholder="Bijv. Geschiedenis, Aardrijkskunde..."
                                        autoFocus={formData.level === 'VMBO'}
                                    />
                                    <button 
                                        onClick={() => customSubject && goNext()}
                                        className={`absolute right-2 top-2 bottom-2 px-3 rounded-lg transition-all ${customSubject ? 'bg-teal-600 text-white' : 'bg-transparent text-slate-700'}`}
                                    >
                                        →
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- STEP 4: GRADE/YEAR --- */}
                    {step === 4 && (
                        <div className="w-full text-center">
                            <h2 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-tight">{t.step4_title}</h2>
                            <p className="text-slate-400 mb-10 text-lg">{t.step4_sub}</p>
                            
                            <div className="bg-slate-800/50 px-6 py-3 rounded-lg mb-10 border border-slate-700/50 inline-flex items-center gap-4">
                                <div className="text-left">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Vak</span>
                                    <span className="text-sm font-bold text-teal-400">{formData.subject}</span>
                                </div>
                                <div className="h-8 w-px bg-slate-700"></div>
                                <div className="text-left">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Niveau</span>
                                    <span className="text-sm font-bold text-white">{formData.level}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-2xl mx-auto">
                                {getGradeOptions().map(grade => (
                                    <button
                                        key={grade}
                                        type="button"
                                        onClick={() => handleGradeSelect(grade)}
                                        className="group relative p-6 rounded-2xl border border-slate-700 bg-slate-800/30 hover:bg-slate-800 hover:border-teal-500/50 transition-all duration-300 active:scale-95"
                                    >
                                        <div className="text-lg font-bold text-slate-300 group-hover:text-white mb-1">{grade}</div>
                                        <div className="text-[10px] text-slate-500 uppercase tracking-wider group-hover:text-teal-500 transition-colors">Selecteer</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- STEP 5: GOAL/INTRO --- */}
                    {step === 5 && (
                        <div className="w-full text-center">
                            <h2 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-tight">{t.step5_title}</h2>
                            <p className="text-slate-400 mb-8 text-lg">{t.step5_sub}</p>
                            
                            <div className="flex gap-3 justify-center mb-8">
                                <div className="bg-slate-900/50 px-4 py-2 rounded border border-slate-800 text-xs font-mono text-slate-400">
                                    {formData.name}
                                </div>
                                <div className="bg-slate-900/50 px-4 py-2 rounded border border-slate-800 text-xs font-mono text-teal-400">
                                    {formData.subject} ({formData.level}) • {formData.grade}
                                </div>
                            </div>

                            <textarea 
                                autoFocus
                                value={goal}
                                onChange={e => setGoal(e.target.value)}
                                className="w-full max-w-lg h-32 bg-slate-800/30 rounded-xl px-6 py-5 text-lg text-white placeholder-slate-600 focus:bg-slate-800/50 focus:ring-1 focus:ring-teal-500/50 outline-none resize-none leading-relaxed mx-auto block"
                                placeholder="Ik wil oefenen met..."
                            />
                        </div>
                    )}
                </div>

                <div className="mt-12 flex flex-col items-center gap-6">
                    <div className="flex gap-4">
                        {step > 1 && (
                            <button type="button" onClick={goBack} className="px-6 py-3 text-slate-500 hover:text-white transition-colors text-sm font-medium">Terug</button>
                        )}
                        <button type="submit" className="px-10 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-full shadow-lg shadow-teal-900/20 transition-all transform hover:scale-105 active:scale-95 text-sm tracking-wide">
                            {step === 5 ? "Start Sessie" : "Volgende"}
                        </button>
                    </div>
                </div>
            </form>
      </div>
    </div>
  );
};