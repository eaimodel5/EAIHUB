import React, { useState, useEffect, useRef } from 'react';

interface SecretLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const SecretLogin: React.FC<SecretLoginProps> = ({ onSuccess, onCancel }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === 'AnalyseAdvies') {
        onSuccess();
    } else {
        setError(true);
        setInput('');
        setTimeout(() => setError(false), 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-[#0f172a] border border-slate-700 w-full max-w-sm rounded-xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="mb-4 text-center">
                <div className="w-12 h-12 bg-slate-800 rounded-full mx-auto flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                </div>
                <h3 className="text-white font-bold text-sm uppercase tracking-widest">Restricted Access</h3>
                <p className="text-xs text-slate-500 mt-1">EAI Engineering Console</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                    ref={inputRef}
                    type="password" 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Enter access key..."
                    className={`w-full bg-black/40 border ${error ? 'border-red-500 text-red-500 placeholder-red-500/50' : 'border-slate-700 text-white placeholder-slate-600'} rounded px-3 py-2 text-sm text-center font-mono outline-none focus:border-cyan-500 transition-colors`}
                />
                <div className="flex gap-2">
                    <button 
                        type="button" 
                        onClick={onCancel}
                        className="flex-1 py-2 text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors"
                    >
                        CANCEL
                    </button>
                    <button 
                        type="submit"
                        className="flex-1 bg-cyan-900/50 hover:bg-cyan-800/50 text-cyan-200 border border-cyan-800 py-2 rounded text-xs font-bold tracking-wider transition-all"
                    >
                        ACCESS
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default SecretLogin;