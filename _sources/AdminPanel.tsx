import React from 'react';

const AdminPanel: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-2xl font-semibold">Admin Console</h1>
        <p className="text-sm text-slate-400">Beheer gebruikers, consent en audits (placeholder).</p>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-widest text-slate-400">Status</p>
          <p className="text-sm mt-2">Admin functionaliteit wordt in fase 2 uitgebreid met governance, audit exports en tenant-beheer.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
