import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-teal-500/30 selection:text-teal-200 overflow-x-hidden flex flex-col">
      
      {/* NAVIGATION: Semantic <nav> with list structure */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center bg-gradient-to-b from-[#020617] via-[#020617]/90 to-transparent backdrop-blur-sm border-b border-white/5" aria-label="Hoofdnavigatie">
        <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse shadow-[0_0_10px_#14b8a6]" aria-hidden="true"></div>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-white">EAI Studio <span className="text-slate-500">v10.0</span></span>
        </div>
        <ul className="flex gap-6 text-xs font-bold tracking-widest uppercase items-center list-none m-0 p-0">
            {/* LINK TO SUBPAGE */}
            <li className="hidden sm:block">
                <Link to="/concept" className="text-slate-300 hover:text-white transition-colors border-b border-transparent hover:border-teal-500 pb-0.5">
                    Architectuur & Uitleg
                </Link>
            </li>
            
            <li className="hidden sm:block" aria-hidden="true">
                <div className="h-4 w-px bg-slate-800"></div>
            </li>

            <li>
                <Link to="/teacher" className="text-slate-400 hover:text-teal-400 transition-colors">
                    Docent
                </Link>
            </li>
            <li>
                <Link to="/student" className="bg-teal-600 text-white border border-teal-500 px-5 py-2 rounded hover:bg-teal-500 transition-all shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                    Start Demo
                </Link>
            </li>
        </ul>
      </nav>

      {/* MAIN CONTENT WRAPPER */}
      <main className="flex-grow">
      
          {/* SECTION 1: HERO - Using <header> for the introduction */}
          <header className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 border-b border-white/5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-[#020617]">
            
            {/* Abstract Tech Background (Decorative) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" aria-hidden="true"></div>
            <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-teal-900/10 blur-[120px] rounded-full pointer-events-none" aria-hidden="true"></div>

            <div className="max-w-7xl mx-auto w-full pt-20 relative z-10">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-teal-500/30 bg-teal-950/30 text-teal-400 text-[10px] font-bold uppercase tracking-widest mb-8 backdrop-blur-md" role="status">
                    <span className="flex h-2 w-2 relative" aria-hidden="true">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                    </span>
                    Kernel v15.0 Active
                </div>
                
                <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tighter leading-[0.95] mb-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    <span className="block text-slate-500">VAN CHATBOT</span>
                    <span className="block text-white">NAAR</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500">
                        DIDACTISCHE ENGINE.
                    </span>
                </h1>
                
                <div className="max-w-3xl mt-10 border-l-2 border-teal-500/50 pl-8 animate-in fade-in slide-in-from-left-10 duration-1000 delay-300">
                    <p className="text-xl text-slate-300 leading-relaxed font-light">
                        Standaard AI gokt het volgende woord. <strong>EAI Studio berekent de volgende leerstap.</strong>
                        <br/><br/>
                        Wij vervangen de 'Black Box' door een transparant didactisch model (SSOT). 
                        Zo krijgt de leerling geen antwoorden, maar inzicht. En de docent geen zorgen, maar controle.
                    </p>
                    
                    <div className="mt-10 flex flex-col sm:flex-row gap-5">
                        <Link to="/student" className="group bg-white text-black hover:bg-teal-50 px-8 py-4 rounded text-center text-sm font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3" aria-label="Start Student Studio">
                            Start Student Studio 
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                        </Link>
                        <Link to="/concept" className="border border-slate-700 hover:border-white text-slate-400 hover:text-white px-8 py-4 rounded text-center text-sm font-bold uppercase tracking-widest transition-all">
                            Hoe werkt het?
                        </Link>
                    </div>
                </div>
            </div>
          </header>

          {/* SECTION 2: ACCESS CARDS - Using <article> for independent content blocks */}
          <section className="py-24 px-6 bg-[#020617] border-t border-white/5" aria-labelledby="access-title">
              <h2 id="access-title" className="sr-only">Kies uw rol</h2>
              <div className="max-w-5xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* CARD 1 */}
                      <Link to="/student" className="group relative block bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl overflow-hidden hover:border-teal-500/50 transition-all hover:shadow-2xl hover:shadow-teal-900/10 focus:outline-none focus:ring-2 focus:ring-teal-500">
                          <article className="p-10 h-full flex flex-col">
                              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity" aria-hidden="true">
                                  <svg className="w-32 h-32 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                              </div>
                              <header className="mb-4">
                                  <span className="text-teal-500 font-bold text-xs uppercase tracking-widest block mb-2">Voor Leerlingen</span>
                                  <h3 className="text-2xl font-bold text-white">Student Studio</h3>
                              </header>
                              <p className="text-slate-400 mb-8 max-w-sm leading-relaxed flex-1">
                                  Geen antwoordenmachine, maar een Socratische coach. Start een sessie voor Biologie, Wiskunde of Economie en leer dieper.
                              </p>
                              <div className="inline-flex items-center text-teal-400 font-bold uppercase text-xs tracking-widest group-hover:gap-3 transition-all">
                                  Start Sessie <span className="text-lg ml-2" aria-hidden="true">→</span>
                              </div>
                          </article>
                      </Link>

                      {/* CARD 2 */}
                      <Link to="/teacher" className="group relative block bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl overflow-hidden hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-900/10 focus:outline-none focus:ring-2 focus:ring-purple-500">
                          <article className="p-10 h-full flex flex-col">
                              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity" aria-hidden="true">
                                  <svg className="w-32 h-32 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                              </div>
                              <header className="mb-4">
                                  <span className="text-purple-500 font-bold text-xs uppercase tracking-widest block mb-2">Voor Docenten</span>
                                  <h3 className="text-2xl font-bold text-white">Teacher Cockpit</h3>
                              </header>
                              <p className="text-slate-400 mb-8 max-w-sm leading-relaxed flex-1">
                                  Kijk "onder de motorkap". Bekijk live analytics, detecteer welke leerlingen vastlopen en stuur didactische interventies.
                              </p>
                              <div className="inline-flex items-center text-purple-400 font-bold uppercase text-xs tracking-widest group-hover:gap-3 transition-all">
                                  Open Dashboard <span className="text-lg ml-2" aria-hidden="true">→</span>
                              </div>
                          </article>
                      </Link>
                  </div>
              </div>
          </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 px-6 bg-[#010205]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-center md:text-left">
                  <div className="text-lg font-bold tracking-tight text-white mb-1">EAI STUDIO 10.0</div>
                  <p className="text-xs text-slate-500">© 2025 Educational Artificial Intelligence Engineering.</p>
              </div>
              
              <div className="flex gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800" role="status">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" aria-hidden="true"></div>
                      <span className="text-[10px] font-mono text-emerald-500 uppercase">System Operational</span>
                  </div>
              </div>
          </div>
      </footer>

    </div>
  );
};

export default LandingPage;