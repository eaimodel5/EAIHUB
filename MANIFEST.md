# Manifest (no shortcuts)

This zip contains two things:

1) **Lovable app (root)**: a clean Vite + React + TS project.
   - Single source of truth is `/src` (copied from `apps/web/src` in your original zip).
   - Added Supabase client toggled by env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
   - Supabase schema is in `/supabase/schema.sql`.

2) **Reference snapshot**: `_sources/` contains the full extracted original `eai-studio-10.0` (and previous packs),
   preserved for traceability. Lovable should ignore `_sources/`.

How to run locally:
- copy `.env.example` to `.env` and fill Supabase vars (optional)
- `npm i` or `pnpm i`
- `npm run dev`

