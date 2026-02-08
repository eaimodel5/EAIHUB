
import React, { useState } from 'react';
import { EAI_CORE } from '../utils/ssotParser';

interface CommandPaletteProps {
  onSelectCommand: (command: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ onSelectCommand, onClose, isOpen }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredCommands = EAI_CORE.commands.filter(cmd => {
    const matchesSearch = cmd.command.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          cmd.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose}>
      <div className="bg-[#0f172a] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] border border-slate-700 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex items-center gap-3 bg-[#0b1120]">
          <div className="bg-cyan-900/30 p-2 rounded-lg text-cyan-400 border border-cyan-500/30">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
             <h3 className="font-bold text-slate-200 uppercase tracking-wide text-sm">Interventie Bibliotheek</h3>
             <p className="text-[10px] text-slate-500">SSOT Command Injection</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-full transition-colors text-slate-500 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-800">
          <input 
            type="text" 
            placeholder="Zoek commando (bijv. /devil, /meta)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none font-mono text-sm"
            autoFocus
          />
        </div>
        
        {/* List */}
        <div className="flex-1 overflow-y-auto p-2 scrollbar-hide bg-[#0f172a]">
          {filteredCommands.map((cmd) => (
            <button
              key={cmd.command}
              onClick={() => {
                  onSelectCommand(cmd.command);
                  onClose();
              }}
              className="w-full text-left group flex flex-col p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-slate-700 mb-1"
            >
              <div className="flex items-center justify-between w-full mb-1">
                <code className="text-cyan-400 font-mono font-bold text-xs bg-cyan-900/20 px-2 py-0.5 rounded border border-cyan-500/20 group-hover:bg-cyan-900/40">
                  {cmd.command}
                </code>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 pl-1">
                {cmd.description}
              </p>
            </button>
          ))}
          
          {filteredCommands.length === 0 && (
              <div className="p-8 text-center text-slate-600 italic text-xs">
                  Geen resultaten gevonden in SSOT.
              </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#0b1120] p-3 text-center border-t border-slate-800">
             <span className="text-[9px] text-slate-600 uppercase font-mono tracking-widest">EAI Command Center v9.0</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;