import { supabaseEnabled, supabase } from "../lib/supabaseClient";

export type RunRow = {
  id?: string;
  actor_type: string;
  actor_id: string;
  impact: "formatief" | "summatief" | "beleid";
  workflow_id: string;
  ssot_version: string;
  status: "created" | "running" | "waiting_human" | "completed" | "failed";
  input_ref?: string | null;
  notes?: string | null;
};

export type ArtefactRow = {
  id?: string;
  run_id: string;
  kind?: string;
  provider?: string | null;
  model?: string | null;
  content: string;
};

export type AuditRow = {
  id?: string;
  event_type: string;
  run_id?: string | null;
  payload?: any;
};

const LS_RUNS = "eai:runs:v1";
const LS_ARTEFACTS = "eai:artefacts:v1";
const LS_AUDIT = "eai:audit:v1";

function lsGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function lsSet<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function uuidLike(): string {
  // Not cryptographically secure; fine for local mock persistence.
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function persistenceMode() {
  return supabaseEnabled && supabase ? "supabase" : "local";
}

export async function saveRun(run: RunRow) {
  if (supabaseEnabled && supabase) {
    const { data, error } = await supabase.from("runs").insert(run).select("*").single();
    if (error) throw error;
    return { ok: true as const, mode: "supabase" as const, data };
  }

  const runs = lsGet<RunRow[]>(LS_RUNS, []);
  const row: RunRow = { ...run, id: run.id ?? uuidLike() };
  runs.unshift(row);
  lsSet(LS_RUNS, runs);
  return { ok: true as const, mode: "local" as const, data: row };
}

export async function listRuns() {
  if (supabaseEnabled && supabase) {
    const { data, error } = await supabase.from("runs").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return { ok: true as const, mode: "supabase" as const, data };
  }

  const runs = lsGet<RunRow[]>(LS_RUNS, []);
  return { ok: true as const, mode: "local" as const, data: runs };
}

export async function saveArtefact(a: ArtefactRow) {
  if (supabaseEnabled && supabase) {
    const { data, error } = await supabase.from("artefacts").insert(a).select("*").single();
    if (error) throw error;
    return { ok: true as const, mode: "supabase" as const, data };
  }

  const artefacts = lsGet<ArtefactRow[]>(LS_ARTEFACTS, []);
  const row: ArtefactRow = { ...a, id: a.id ?? uuidLike() };
  artefacts.unshift(row);
  lsSet(LS_ARTEFACTS, artefacts);
  return { ok: true as const, mode: "local" as const, data: row };
}

export async function listArtefacts(run_id?: string) {
  if (supabaseEnabled && supabase) {
    let q = supabase.from("artefacts").select("*").order("created_at", { ascending: false });
    if (run_id) q = q.eq("run_id", run_id);
    const { data, error } = await q;
    if (error) throw error;
    return { ok: true as const, mode: "supabase" as const, data };
  }

  const artefacts = lsGet<ArtefactRow[]>(LS_ARTEFACTS, []);
  const filtered = run_id ? artefacts.filter(a => a.run_id === run_id) : artefacts;
  return { ok: true as const, mode: "local" as const, data: filtered };
}

export async function logAudit(e: AuditRow) {
  if (supabaseEnabled && supabase) {
    const { error } = await supabase.from("audit_log").insert(e);
    if (error) throw error;
    return { ok: true as const, mode: "supabase" as const };
  }

  const audit = lsGet<AuditRow[]>(LS_AUDIT, []);
  audit.unshift({ ...e, id: e.id ?? uuidLike() });
  lsSet(LS_AUDIT, audit);
  return { ok: true as const, mode: "local" as const };
}

export async function listAudit(limit = 200) {
  if (supabaseEnabled && supabase) {
    const { data, error } = await supabase.from("audit_log").select("*").order("created_at", { ascending: false }).limit(limit);
    if (error) throw error;
    return { ok: true as const, mode: "supabase" as const, data };
  }

  const audit = lsGet<AuditRow[]>(LS_AUDIT, []);
  return { ok: true as const, mode: "local" as const, data: audit.slice(0, limit) };
}

export async function getRun(id: string) {
  if (supabaseEnabled && supabase) {
    const { data, error } = await supabase.from("runs").select("*").eq("id", id).single();
    if (error) throw error;
    return { ok: true as const, mode: "supabase" as const, data };
  }
  const runs = lsGet<RunRow[]>(LS_RUNS, []);
  const found = runs.find(r => r.id === id) || null;
  return { ok: true as const, mode: "local" as const, data: found };
}

export async function updateRun(id: string, patch: Partial<RunRow>) {
  if (supabaseEnabled && supabase) {
    const { data, error } = await supabase.from("runs").update(patch).eq("id", id).select("*").single();
    if (error) throw error;
    return { ok: true as const, mode: "supabase" as const, data };
  }

  const runs = lsGet<RunRow[]>(LS_RUNS, []);
  const idx = runs.findIndex(r => r.id === id);
  if (idx === -1) return { ok: false as const, mode: "local" as const, data: null };
  runs[idx] = { ...runs[idx], ...patch, id };
  lsSet(LS_RUNS, runs);
  return { ok: true as const, mode: "local" as const, data: runs[idx] };
}
