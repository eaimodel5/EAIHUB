import React, { useEffect, useState } from 'react';
import { runSystemAudit, performAdminAction, SystemHealth, getStorageInspectorData, deleteStorageItem, StorageItem } from '../services/adminService';
import { SSOT_DATA } from '../data/ssot';
import { CURRICULUM_PATHS } from '../data/curriculum';

const AdminPanel: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [activeTab, setActiveTab] = useState<'SYSTEM' | 'DATA (F12)' | 'SSOT' | 'CONTENT'>('SYSTEM');
  const [actionStatus, setActionStatus] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [storageItems, setStorageItems] = useState<StorageItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<StorageItem | null>(null);

  const refreshData = async () => {
    const data = await runSystemAudit();
    setHealth(data);
    setStorageItems(getStorageInspectorData());
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 5000); // Faster polling for live debugging
    return () => clearInterval(interval);
  }, []);

  // Refresh storage when switching to DATA tab
  useEffect(() => {
      if (activeTab === 'DATA (F12)') {
          setStorageItems(getStorageInspectorData());
          setSelectedItem(null);
      }
  }, [activeTab]);

  const handleDeleteItem = (key: string) => {
      if(window.confirm(`Delete key "${key}"? This cannot be undone.`)) {
          deleteStorageItem(key);
          setStorageItems(getStorageInspectorData());
          if (selectedItem?.key === key) setSelectedItem(null);
      }
  };

  const executeAction = async (action: 'CLEAR_CACHE' | 'EXPORT_LOGS' | 'RESET_IDENTITY' | 'FIX_CORRUPTION') => {
      if (!window.confirm("Are you sure? This action impacts the local runtime.")) return;
      
      setIsProcessing(true);
      setActionStatus("Processing...");
      
      try {
          const result = await performAdminAction(action);
          setActionStatus(result.message);
          await refreshData();
      } catch (e) {
          setActionStatus("Action Failed.");
      } finally {
          setIsProcessing(false);
          setTimeout(() => setActionStatus(null), 3000);
      }
  };

  if (!health) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-slate-500 font-mono text-xs">BOOTING ADMIN KERNEL...</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-4 sm:p-6 overflow-y-auto font-sans pb-20">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER & GLOBAL STATUS */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <div className={`w-3 h-3 rounded-full animate-pulse ${health.integrityScore >= 90 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                <span className={`${health.integrityScore >= 90 ? 'text-emerald-500' : 'text-red-500'} text-[10px] font-bold uppercase tracking-widest`}>
                    System Integrity: {health.integrityScore}%
                </span>
                {health.telemetry.isFallbackActive && (
                    <span className="ml-2 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">
                        MOCK DATA ACTIVE
                    </span>
                )}
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">EAI Governance Console</h1>
          </div>
          
          <div className="flex gap-2 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
              {(['SYSTEM', 'DATA (F12)', 'SSOT', 'CONTENT'] as const).map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors ${activeTab === tab ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                      {tab}
                  </button>
              ))}
          </div>
        </header>

        {/* FEEDBACK TOAST */}
        {actionStatus && (
            <div className="fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-2xl z-50 animate-in slide-in-from-bottom-4 font-bold text-sm">
                {actionStatus}
            </div>
        )}

        {/* TAB 1: SYSTEM HEALTH & ACTIONS */}
        {activeTab === 'SYSTEM' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                
                {/* RUNTIME TELEMETRY ROW */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* BROWSER ENV (REAL F12 DATA) */}
                    <div className="border border-slate-700 bg-slate-900/30 p-6 rounded-xl relative overflow-hidden">
                        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            Client Environment (Real)
                        </h3>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-mono">
                            <div className="text-slate-500">Platform:</div>
                            <div className="text-white text-right">{health.browser.platform}</div>
                            <div className="text-slate-500">User Agent:</div>
                            <div className="text-white text-right truncate" title={health.browser.userAgent}>{health.browser.userAgent.substring(0, 20)}...</div>
                            <div className="text-slate-500">Screen:</div>
                            <div className="text-white text-right">{health.browser.screen}</div>
                            <div className="text-slate-500">Memory:</div>
                            <div className="text-white text-right">{health.browser.memory}</div>
                            <div className="text-slate-500">Connection:</div>
                            <div className="text-white text-right">{health.browser.connection}</div>
                            <div className="text-slate-500">Cores:</div>
                            <div className="text-white text-right">{health.browser.hardwareConcurrency}</div>
                        </div>
                    </div>

                    <div className={`border p-6 rounded-xl relative overflow-hidden ${health.telemetry.isFallbackActive ? 'bg-red-950/10 border-red-500/50' : 'bg-emerald-950/10 border-emerald-500/50'}`}>
                        <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${health.telemetry.isFallbackActive ? 'text-red-400' : 'text-emerald-400'}`}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            AI Runtime Status
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400">Environment API Key</span>
                                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${health.telemetry.apiKeyConfigured ? 'bg-emerald-900/30 text-emerald-400' : 'bg-red-900/30 text-red-400'}`}>
                                    {health.telemetry.apiKeyConfigured ? 'CONFIGURED' : 'MISSING'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400">Inference Mode</span>
                                <span className={`text-xs font-mono font-bold ${health.telemetry.isFallbackActive ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`}>
                                    {health.telemetry.isFallbackActive ? 'MOCK / SIMULATION' : 'LIVE GEMINI 1.5'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400">Logic Integrity Self-Test</span>
                                <span className={`text-xs font-mono font-bold ${health.telemetry.logicEngineStatus === 'OPERATIONAL' ? 'text-green-400' : 'text-red-500'}`}>
                                    {health.telemetry.logicEngineStatus}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* STORAGE METRICS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#0b1120] border border-slate-800 p-5 rounded-xl">
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">Storage Usage</div>
                        <div className="text-2xl font-bold text-white font-mono">{(health.storage.usedBytes / 1024).toFixed(2)} KB</div>
                        <div className="text-[10px] text-slate-400 mt-1">~{health.storage.quotaEstimate.toFixed(1)}% of Quota</div>
                    </div>
                    <div className="bg-[#0b1120] border border-slate-800 p-5 rounded-xl">
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">Object Count</div>
                        <div className="text-2xl font-bold text-white font-mono">{health.storage.keyCount}</div>
                        <div className="text-[10px] text-slate-400 mt-1">Local Keys Found</div>
                    </div>
                    <div className="bg-[#0b1120] border border-slate-800 p-5 rounded-xl">
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">Active Logic Gates</div>
                        <div className="text-2xl font-bold text-indigo-400 font-mono">{health.activeGates}</div>
                        <div className="text-[10px] text-slate-400 mt-1">Enforcing Protocols</div>
                    </div>
                    <div className="bg-[#0b1120] border border-slate-800 p-5 rounded-xl">
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">Data Corruption</div>
                        <div className={`text-2xl font-bold font-mono ${health.storage.corruptKeys.length > 0 ? 'text-red-500' : 'text-slate-600'}`}>
                            {health.storage.corruptKeys.length}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">Malformed JSON Keys</div>
                    </div>
                </div>

                {/* ACTIONS PANEL */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 bg-[#0b1120] border border-slate-800 rounded-xl p-6">
                        <h3 className="text-white font-bold text-sm uppercase tracking-wide mb-4">Maintenance Actions</h3>
                        <div className="space-y-3">
                            <button 
                                onClick={() => executeAction('CLEAR_CACHE')}
                                disabled={isProcessing}
                                className="w-full text-left p-3 rounded bg-slate-800 hover:bg-red-900/30 border border-slate-700 hover:border-red-500/50 transition-all group"
                            >
                                <div className="text-xs font-bold text-white group-hover:text-red-400 mb-1">Purge Local Storage</div>
                                <div className="text-[10px] text-slate-500">Clears all profiles, history, and cache.</div>
                            </button>
                            <button 
                                onClick={() => executeAction('RESET_IDENTITY')}
                                disabled={isProcessing}
                                className="w-full text-left p-3 rounded bg-slate-800 hover:bg-orange-900/30 border border-slate-700 hover:border-orange-500/50 transition-all group"
                            >
                                <div className="text-xs font-bold text-white group-hover:text-orange-400 mb-1">Reset Identity</div>
                                <div className="text-[10px] text-slate-500">Generates a new User ID on next load.</div>
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-[#0b1120] border border-slate-800 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-white font-bold text-sm uppercase tracking-wide">Data Export</h3>
                            <button 
                                onClick={() => executeAction('EXPORT_LOGS')}
                                disabled={isProcessing}
                                className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded font-bold transition-colors flex items-center gap-2"
                            >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Download Audit Log
                            </button>
                        </div>
                        <p className="text-xs text-slate-400 mb-4">
                            Generate a full JSON dump of the current system state, including SSOT validation results, storage metrics, and browser environment data. Useful for debugging and compliance checks.
                        </p>
                        <div className="bg-black/30 rounded p-3 font-mono text-[10px] text-slate-500 overflow-x-auto">
                            {`{ "timestamp": "${new Date().toISOString()}", "integrity": ${health.integrityScore}, "user": "..." }`}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* TAB 2: DATA INSPECTOR (F12 STYLE) */}
        {activeTab === 'DATA (F12)' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 h-[600px] flex flex-col md:flex-row gap-6">
                
                {/* Left: Key List */}
                <div className="w-full md:w-1/3 bg-[#0b1120] border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-800 bg-slate-900/30 flex justify-between items-center">
                        <h3 className="font-bold text-sm text-slate-300 uppercase tracking-wide">Storage Keys ({storageItems.length})</h3>
                        <div className="text-[9px] bg-slate-800 text-slate-400 px-2 py-1 rounded">REAL F12 DATA</div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2">
                        {storageItems.map(item => (
                            <button
                                key={item.key}
                                onClick={() => setSelectedItem(item)}
                                className={`w-full text-left p-3 rounded mb-1 border transition-all flex items-center gap-3 ${selectedItem?.key === item.key ? 'bg-teal-900/20 border-teal-500/50' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                            >
                                <div className={`w-2 h-2 rounded-full shrink-0 ${
                                    item.isCorrupt ? 'bg-red-500' :
                                    item.type === 'PROFILE' ? 'bg-blue-400' :
                                    item.type === 'MASTERY' ? 'bg-green-400' :
                                    item.type === 'SESSION' ? 'bg-purple-400' : 'bg-slate-600'
                                }`}></div>
                                <div className="min-w-0 overflow-hidden">
                                    <div className="text-xs font-mono text-slate-300 truncate font-bold">{item.key}</div>
                                    <div className="text-[9px] text-slate-500 uppercase">{item.type} • {item.size} bytes</div>
                                </div>
                            </button>
                        ))}
                        {storageItems.length === 0 && (
                            <div className="p-8 text-center text-slate-500 text-xs italic">Local Storage is empty.</div>
                        )}
                    </div>
                </div>

                {/* Right: Value Viewer */}
                <div className="flex-1 bg-[#0b1120] border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                    {selectedItem ? (
                        <>
                            <div className="p-4 border-b border-slate-800 bg-slate-900/30 flex justify-between items-center">
                                <div className="font-mono text-xs text-teal-400 font-bold">{selectedItem.key}</div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleDeleteItem(selectedItem.key)}
                                        className="text-[10px] text-red-400 hover:text-red-300 font-bold uppercase border border-red-900/50 bg-red-900/20 px-3 py-1 rounded transition-colors"
                                    >
                                        Delete Key
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-auto p-4 bg-[#050914] font-mono">
                                {selectedItem.isCorrupt ? (
                                    <div className="text-red-400 text-xs p-4 border border-red-900/50 rounded bg-red-900/10">
                                        ⚠️ JSON PARSE ERROR: Raw Data corrupted.
                                        <div className="mt-2 text-slate-500 border-t border-red-900/30 pt-2 break-all">
                                            {String(selectedItem.value)}
                                        </div>
                                    </div>
                                ) : (
                                    <pre className="text-[10px] text-green-300 leading-relaxed whitespace-pre-wrap break-all">
                                        {JSON.stringify(selectedItem.value, null, 2)}
                                    </pre>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
                            <svg className="w-12 h-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                            <p className="text-xs uppercase tracking-widest font-bold">Select a key to inspect</p>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* TAB 3: SSOT INSPECTOR */}
        {activeTab === 'SSOT' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* LOGIC GATES */}
                    <div className="lg:col-span-2 bg-[#0b1120] border border-slate-800 rounded-xl overflow-hidden">
                        <div className="p-4 border-b border-slate-800 bg-slate-900/30">
                            <h3 className="font-bold text-sm text-indigo-400 uppercase tracking-wide">Logic Gate Registry</h3>
                        </div>
                        <div className="divide-y divide-slate-800/50">
                            {SSOT_DATA.interaction_protocol.logic_gates.map((gate, idx) => (
                                <div key={idx} className="p-4 hover:bg-white/5 transition-colors group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold bg-slate-800 text-white px-2 py-0.5 rounded border border-slate-700">{gate.trigger_band}</span>
                                            <span className="text-xs text-slate-300 font-bold">{gate.condition}</span>
                                        </div>
                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${gate.priority === 'CRITICAL' ? 'text-red-400 border-red-900/50 bg-red-900/20' : 'text-orange-400 border-orange-900/50 bg-orange-900/20'}`}>
                                            {gate.priority}
                                        </span>
                                    </div>
                                    <div className="pl-3 border-l-2 border-slate-700">
                                        <p className="text-[11px] text-slate-400 font-mono">{gate.enforcement}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* COMMANDS */}
                    <div className="bg-[#0b1120] border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[500px]">
                        <div className="p-4 border-b border-slate-800 bg-slate-900/30">
                            <h3 className="font-bold text-sm text-pink-400 uppercase tracking-wide">Command Library ({health.activeCommands})</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
                            {Object.entries(SSOT_DATA.command_library.commands).map(([cmd, desc]) => (
                                <div key={cmd} className="p-3 mb-1 hover:bg-white/5 rounded transition-colors cursor-default">
                                    <code className="text-xs font-bold text-pink-300 block mb-1">{cmd}</code>
                                    <p className="text-[10px] text-slate-500 leading-tight">{desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* TAB 4: CURRICULUM INSPECTOR */}
        {activeTab === 'CONTENT' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-[#0b1120] border border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-900/50 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-800">
                            <tr>
                                <th className="px-6 py-4">Module</th>
                                <th className="px-6 py-4">Level</th>
                                <th className="px-6 py-4">Topic</th>
                                <th className="px-6 py-4">Nodes</th>
                                <th className="px-6 py-4">Study Load</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {CURRICULUM_PATHS.map((path, idx) => (
                                <tr key={idx} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-bold text-white">{path.subject}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 text-[10px] font-bold">{path.level}</span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-300">{path.topic}</td>
                                    <td className="px-6 py-4 font-mono text-teal-400">{path.nodes.length}</td>
                                    <td className="px-6 py-4 font-mono text-slate-500">
                                        {path.nodes.reduce((a, b) => a + (b.study_load_minutes || 0), 0)} min
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Node Detail Cards (Sample) */}
                    {CURRICULUM_PATHS[0].nodes.slice(0, 3).map(node => (
                        <div key={node.id} className="bg-slate-900/30 border border-slate-800 p-4 rounded-xl">
                            <div className="flex justify-between mb-2">
                                <span className="text-[9px] font-bold text-slate-500 uppercase">{node.id}</span>
                                <span className="text-[9px] font-bold text-teal-500 uppercase">{node.didactic_focus}</span>
                            </div>
                            <h4 className="text-sm font-bold text-white mb-2">{node.title}</h4>
                            <p className="text-[10px] text-slate-400 mb-3 line-clamp-2">{node.description}</p>
                            <div className="text-[9px] bg-black/30 p-2 rounded text-slate-500 font-mono">
                                Check: {node.mastery_criteria}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default AdminPanel;