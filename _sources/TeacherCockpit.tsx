import React, { useEffect, useState } from 'react';
import { fetchAnalytics } from '../services/analyticsService';
import { createAssignment, listAssignments } from '../services/assignmentService';

const TeacherCockpit: React.FC = () => {
  const [analytics, setAnalytics] = useState<{ activeSessions: number; totalMessages: number; avgLatencyMs: number; breachRate: number } | null>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [pathId, setPathId] = useState('WISB_VWO_DIFF');
  const [classId, setClassId] = useState('class-1');

  const loadData = async () => {
    const [snapshot, assignmentData] = await Promise.all([
      fetchAnalytics(),
      listAssignments({ classId })
    ]);
    setAnalytics(snapshot);
    setAssignments(assignmentData.assignments || []);
  };

  useEffect(() => {
    loadData().catch(() => undefined);
  }, [classId]);

  const handleCreate = async () => {
    await createAssignment({ classId, pathId });
    await loadData();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">Docent Cockpit</p>
            <h1 className="text-2xl font-semibold">EAI Studio 10.0</h1>
          </div>
          <div className="text-xs text-slate-400">Live status</div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-xl bg-slate-900/70 border border-slate-800 p-4">
            <p className="text-xs text-slate-400">Actieve sessies</p>
            <p className="text-2xl font-semibold">{analytics?.activeSessions ?? 0}</p>
          </div>
          <div className="rounded-xl bg-slate-900/70 border border-slate-800 p-4">
            <p className="text-xs text-slate-400">Totale berichten</p>
            <p className="text-2xl font-semibold">{analytics?.totalMessages ?? 0}</p>
          </div>
          <div className="rounded-xl bg-slate-900/70 border border-slate-800 p-4">
            <p className="text-xs text-slate-400">Gem. latentie</p>
            <p className="text-2xl font-semibold">{analytics?.avgLatencyMs ?? 0}ms</p>
          </div>
          <div className="rounded-xl bg-slate-900/70 border border-slate-800 p-4">
            <p className="text-xs text-slate-400">Breach-rate</p>
            <p className="text-2xl font-semibold">{((analytics?.breachRate ?? 0) * 100).toFixed(1)}%</p>
          </div>
        </section>

        <section className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Assignments</h2>
              <p className="text-xs text-slate-400">Koppel leerlijnen aan klassen of leerlingen</p>
            </div>
            <button onClick={handleCreate} className="px-4 py-2 text-xs uppercase tracking-widest bg-teal-600/90 rounded-lg">Maak assignment</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-xs text-slate-400">Class ID</label>
              <input value={classId} onChange={(e) => setClassId(e.target.value)} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm" />
            </div>
            <div>
              <label className="text-xs text-slate-400">Path ID</label>
              <input value={pathId} onChange={(e) => setPathId(e.target.value)} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm" />
            </div>
          </div>

          <div className="mt-6 space-y-2">
            {assignments.length === 0 && <p className="text-sm text-slate-500">Nog geen assignments.</p>}
            {assignments.map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between border border-slate-800 rounded-lg px-4 py-2 bg-slate-950">
                <div>
                  <p className="text-sm font-medium">{assignment.pathId}</p>
                  <p className="text-xs text-slate-500">Class: {assignment.classId || '-'} • Created {new Date(assignment.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="text-xs text-slate-400">{assignment.id.slice(0, 8)}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TeacherCockpit;
