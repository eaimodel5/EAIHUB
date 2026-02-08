import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const ConceptPage: React.FC = () => {
  
  useEffect(() => {
      window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-teal-900 selection:text-white overflow-x-hidden">
        
      {/* NAVIGATION */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-[#020617]/90 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-2 h-2 bg-teal-500 rounded-sm"></div>
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-white font-mono">EAI_KERNEL_DOCS_v15</span>
            </Link>
        </div>
        <div className="flex gap-6 text-xs font-bold tracking-widest uppercase items-center font-mono">
            <Link to="/" className="text-slate-500 hover:text-white transition-colors">
                [ EXIT ]
            </Link>
            <Link to="/student" className="text-teal-500 hover:text-teal-400 transition-colors">
                [ RUN_INSTANCE ]
            </Link>
        </div>
      </nav>

      {/* HEADER */}
      <header className="pt-32 pb-20 px-6 border-b border-white/5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-[#020617]">
          <div className="max-w-4xl mx-auto">
              <div className="inline-block px-2 py-1 mb-6 border border-teal-500/20 bg-teal-950/20 rounded text-[10px] font-mono text-teal-400 tracking-widest uppercase">
                  Architecture Whitepaper
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8 leading-tight tracking-tight">
                  Meer dan kennis alleen:<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">De multidimensionale matrix.</span>
              </h1>
              <p className="text-lg text-slate-400 font-light leading-relaxed max-w-2xl">
                  Waarom de meeste AI-tools falen op <em>timing</em> en <em>context</em>, en hoe EAI Studio 10 dimensies (K, P, C, TD...) combineert tot één didactische strategie.
              </p>
          </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-4xl mx-auto px-6 py-20 space-y-32">

          {/* SECTION 1: THE PROBLEM REVISITED */}
          <section>
              <div className="flex items-baseline gap-4 mb-8 border-b border-white/5 pb-4">
                  <span className="text-teal-500 font-mono text-xl font-bold">01.</span>
                  <h2 className="text-2xl font-bold text-white">Het context-vacuüm</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="prose prose-invert prose-sm text-slate-400">
                      <p>
                          In onze eerdere documentatie spraken we over de "Stochastische Papegaai". Maar het probleem is groter. Standaard LLM's (ChatGPT, Gemini) bestaan in een <strong>tijdloos vacuüm</strong>.
                      </p>
                      <p>
                          Als een leerling vraagt: <em>"Hoe werkt een cel?"</em>, geeft de AI direct een uitleg. Didactisch gezien is dat vaak fout. Waarom?
                      </p>
                      <ul className="list-disc pl-4 space-y-2 marker:text-slate-600">
                          <li>
                              Is de leerling zich nog aan het <strong>oriënteren (P1)</strong>? Dan moet je voorkennis activeren, niet zenden.
                          </li>
                          <li>
                              Is de leerling aan het <strong>oefenen (P4)</strong>? Dan moet je feedback geven, geen theorie.
                          </li>
                          <li>
                              Is de leerling aan het <strong>evalueren (P5)</strong>? Dan moet je reflectievragen stellen.
                          </li>
                      </ul>
                      <p className="mt-4 italic text-slate-500">
                          Zonder "Process Awareness" (Rubric P) is elke interactie een gok.
                      </p>
                  </div>
                  
                  <div className="bg-[#0a0f1e] border border-slate-800 rounded-lg p-6 font-mono text-xs overflow-hidden relative flex flex-col justify-center">
                      <div className="space-y-4">
                          <div className="flex justify-between text-slate-500">
                              <span>Input: "Ik snap deze som niet."</span>
                          </div>
                          <div className="p-3 bg-red-900/10 border border-red-900/30 rounded text-red-300">
                              <strong>Legacy AI (Blind):</strong><br/>
                              "Geen probleem! Hier is de uitwerking: 2x + 5 = 10..."<br/>
                              <span className="text-[9px] opacity-70">-> Neemt over (TD5), negeert leerfase.</span>
                          </div>
                          <div className="p-3 bg-teal-900/10 border border-teal-500/30 rounded text-teal-300">
                              <strong>EAI Engine (Context Aware):</strong><br/>
                              "Je zit in de oefenfase (P4). Welke stap heb je al geprobeerd?"<br/>
                              <span className="text-[9px] opacity-70">-> Detecteert P4, forceert TD2 (Activering).</span>
                          </div>
                      </div>
                  </div>
              </div>
          </section>

          {/* SECTION 2: THE MATRIX (K, P, C, TD) */}
          <section>
              <div className="flex items-baseline gap-4 mb-8 border-b border-white/5 pb-4">
                  <span className="text-teal-500 font-mono text-xl font-bold">02.</span>
                  <h2 className="text-2xl font-bold text-white">De didactische kern (K • P • TD)</h2>
              </div>

              <p className="text-slate-400 mb-8 max-w-2xl">
                  De EAI Kernel berekent voor elke interactie een 3D-coördinaat in de didactische ruimte. Pas als deze coördinaat vaststaat, wordt de tekst gegenereerd.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* CARD K */}
                  <div className="bg-[#0b1120] border border-slate-700 p-5 rounded-xl hover:border-teal-500/50 transition-colors group">
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🧠</div>
                      <h3 className="text-lg font-bold text-white mb-2">Rubric K: Kennis</h3>
                      <div className="text-xs font-mono text-teal-500 mb-3 uppercase tracking-wider">AARD VAN DE STOF</div>
                      <p className="text-sm text-slate-400 leading-relaxed">
                          Gebaseerd op <strong>Ruijssenaars</strong>. Het type kennis bepaalt de didactische strategie.
                      </p>
                      <ul className="mt-4 space-y-2 text-xs text-slate-300 font-mono">
                          <li className="flex gap-2"><span className="text-slate-600 font-bold">K1</span> <span>Feitenkennis (automatiseren)</span></li>
                          <li className="flex gap-2"><span className="text-slate-600 font-bold">K2</span> <span>Procedureel (modeling)</span></li>
                          <li className="flex gap-2"><span className="text-slate-600 font-bold">K3</span> <span>Metacognitie (regulatie)</span></li>
                      </ul>
                  </div>

                  {/* CARD P */}
                  <div className="bg-[#0b1120] border border-slate-700 p-5 rounded-xl hover:border-blue-500/50 transition-colors group">
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">⏱️</div>
                      <h3 className="text-lg font-bold text-white mb-2">Rubric P: Proces</h3>
                      <div className="text-xs font-mono text-blue-500 mb-3 uppercase tracking-wider">HET 'WANNEER'</div>
                      <p className="text-sm text-slate-400 leading-relaxed">
                          De leerfase dicteert de interventie. We skippen geen stappen in de leercyclus.
                      </p>
                      <ul className="mt-4 space-y-2 text-xs text-slate-300 font-mono">
                          <li className="flex gap-2"><span className="text-slate-600 font-bold">P1</span> <span>Oriëntatie (doel)</span></li>
                          <li className="flex gap-2"><span className="text-slate-600 font-bold">P2</span> <span>Voorkennis (activeren)</span></li>
                          <li className="flex gap-2"><span className="text-slate-600 font-bold">P3</span> <span>Instructie (uitleg)</span></li>
                          <li className="flex gap-2"><span className="text-slate-600 font-bold">P4</span> <span>Oefenen (feedback)</span></li>
                          <li className="flex gap-2"><span className="text-slate-600 font-bold">P5</span> <span>Evaluatie (check)</span></li>
                      </ul>
                  </div>

                  {/* CARD TD */}
                  <div className="bg-[#0b1120] border border-slate-700 p-5 rounded-xl hover:border-purple-500/50 transition-colors group">
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">⚖️</div>
                      <h3 className="text-lg font-bold text-white mb-2">Rubric TD: Taakdichtheid</h3>
                      <div className="text-xs font-mono text-purple-500 mb-3 uppercase tracking-wider">HET 'WIE'</div>
                      <p className="text-sm text-slate-400 leading-relaxed">
                          Gebaseerd op <strong>Vygotsky (scaffolding)</strong>. Wie draagt de cognitieve last?
                      </p>
                      <ul className="mt-4 space-y-2 text-xs text-slate-300 font-mono">
                          <li className="flex gap-2"><span className="text-slate-600 font-bold">TD1</span> <span>Leerling-dominant</span></li>
                          <li className="flex gap-2"><span className="text-slate-600 font-bold">TD3</span> <span>Gedeeld (samen)</span></li>
                          <li className="flex gap-2"><span className="text-slate-600 font-bold">TD5</span> <span>AI-dominant (voordoen)</span></li>
                      </ul>
                  </div>
              </div>
          </section>

          {/* SECTION 3: THE CODE (SSOT VISUALIZED) */}
          <section>
              <div className="flex items-baseline gap-4 mb-8 border-b border-white/5 pb-4">
                  <span className="text-teal-500 font-mono text-xl font-bold">03.</span>
                  <h2 className="text-2xl font-bold text-white">De code in de praktijk</h2>
              </div>

              <div className="bg-[#0b1221] border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl">
                  <div className="flex border-b border-slate-800 bg-[#050914]">
                      <div className="px-6 py-3 text-xs font-mono text-teal-400 border-b-2 border-teal-500">SSOT_Injection_Layer.ts</div>
                  </div>
                  <div className="p-8 grid grid-cols-1 font-mono text-xs">
                      <div className="space-y-4">
                          <span className="text-slate-500 block">// Voorbeeld: Rubric P (Procesfase) in de SSOT definitie</span>
                          <div className="pl-4 border-l border-slate-700 space-y-2">
                              <span className="block text-blue-400">"P_Procesfase": [</span>
                              
                              <div className="pl-4 opacity-50">
                                  <span className="text-slate-300">{`{ "id": "P1", "label": "Oriëntatie", "fix": "Maak leerdoel expliciet" },`}</span>
                              </div>
                              
                              <div className="pl-4 bg-blue-900/10 -mx-4 px-4 py-2 border-l-2 border-blue-500">
                                  <span className="text-slate-200">{`{ "id": "P2", "label": "Voorkennis", "didactic_principle": "Organisatie", "learner_obs": ["Noemt losse termen", "Mist samenhang"], "ai_obs": ["Laat conceptmap maken", "Vraagt naar relaties"] },`}</span>
                              </div>

                              <div className="pl-4 opacity-50">
                                  <span className="text-slate-300">{`{ "id": "P3", "label": "Instructie", "fix": "Geef compacte uitleg + checkvraag" }`}</span>
                              </div>
                              
                              <span className="block text-blue-400">],</span>
                          </div>

                          <div className="mt-8">
                              <span className="text-slate-500 block mb-2">// Logic Gate: P-aware Blocking</span>
                              <span className="text-purple-400">IF</span> <span className="text-white">(Detected_Phase == "P1_Oriëntatie")</span> <span className="text-purple-400">AND</span> <span className="text-white">(User_Asks == "Geef antwoord")</span> <span className="text-purple-400">THEN</span>:
                              <div className="mt-2 pl-4 text-red-400">
                                  BLOCK_ANSWER(); <br/>
                                  FORCE_RESPONSE("Wat is je doel bij deze opdracht?");
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </section>

          {/* SECTION 4: CO-REGULATION (C) */}
          <section>
              <div className="flex items-baseline gap-4 mb-8 border-b border-white/5 pb-4">
                  <span className="text-teal-500 font-mono text-xl font-bold">04.</span>
                  <h2 className="text-2xl font-bold text-white">De sociale laag (Rubric C)</h2>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="prose prose-invert prose-sm text-slate-400">
                      <p>
                          Naast inhoud (K) en proces (P), monitort de engine ook de <strong>Co-regulatie (C)</strong>. Dit meet de "macht" in het gesprek.
                      </p>
                      <p>
                          Een veelvoorkomend probleem bij AI is dat de leerling passief wordt ("De AI doet het wel"). Rubric C detecteert dit.
                      </p>
                      <ul className="list-none space-y-2 mt-4">
                          <li className="flex items-center gap-3">
                              <span className="text-red-500 font-bold">C1:</span> <span>AI-monoloog (fout: AI zendt teveel)</span>
                          </li>
                          <li className="flex items-center gap-3">
                              <span className="text-yellow-500 font-bold">C3:</span> <span>Gedeelde start (balans)</span>
                          </li>
                          <li className="flex items-center gap-3">
                              <span className="text-green-500 font-bold">C5:</span> <span>Leerling-geankerd (leerling heeft regie)</span>
                          </li>
                      </ul>
                  </div>
                  <div className="bg-[#1a1010] p-6 rounded-xl border border-red-900/30 max-w-sm">
                      <h4 className="text-red-400 font-bold text-sm uppercase mb-2">Gate: AGENCY_LOSS</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                          Als de engine 3x achter elkaar <strong>C1</strong> of <strong>C2</strong> detecteert (leerling leunt achterover), grijpt het systeem in met een "Wake-up Call": 
                          <br/><br/>
                          <em>"Ik merk dat ik nu het werk doe. Neem jij de volgende stap?"</em>
                      </p>
                  </div>
              </div>
          </section>

          {/* SECTION 5: CONCLUSION */}
          <section className="border-t border-white/10 pt-12">
              <h2 className="text-2xl font-bold text-white mb-6">Conclusie: een deterministisch fundament</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                  EAI Studio is geen "wrapper" om ChatGPT. Het is een architectuur die de probabilistische output van LLM's dwingt in een deterministisch didactisch kader (SSOT). Door te sturen op K, P, TD en C garanderen we dat de interactie leerzaam is, niet alleen 'correct'.
              </p>
              <div className="flex gap-4">
                  <Link to="/student" className="bg-white text-black px-8 py-3 rounded font-bold uppercase tracking-widest hover:bg-teal-400 hover:text-white transition-colors">
                      Start de Engine
                  </Link>
              </div>
          </section>

      </div>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 px-6 bg-[#010205]">
          <div className="max-w-7xl mx-auto text-center font-mono text-xs text-slate-600">
              <span className="block mb-2">EAI STUDIO KERNEL v15.0</span>
              <span className="block">Hans Visser EAI Analyse&Advies</span>
          </div>
      </footer>

    </div>
  );
};

export default ConceptPage;