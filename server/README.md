# Ubuntu Pay — Backend

Fastify + Drizzle + TypeScript backend for the GKHACK26 Ubuntu Pay prototype.

## Setup

1. Copy `.env.example` to `.env` and fill in:
   - `DATABASE_URL` — a Postgres connection string (Supabase/Neon/Railway all work)
   - `JWT_SECRET` — any long random string
   - `FRONTEND_ORIGIN` — your Lovable app URL or `http://localhost:5173`

2. Install dependencies:
   ```
   npm install
   ```

3. Push the schema to your database:
   ```
   npm run db:push
   ```

4. Run the dev server:
   ```
   npm run dev
   ```

Server runs on `http://localhost:4000` by default. Check `/health` to confirm it's up.

## What's built (MVP — Must Have tier)

- `POST /auth/register`, `POST /auth/login` — Welcome/Create screen
- `POST /groups` — Savings setup (target, amount, timeframe)
- `POST /groups/:id/join` — Join an existing group
- `GET /groups/:id/dashboard` — saved, target, progress, members
- `POST /contributions` — simple amount + confirm (sandbox, no real money)
- `GET /groups/:id/history` — proof/history: timestamp, status, balance

All contributions are flagged `isDemoData: true` — per the playbook, demo data
should never be passed off as real traction.

## Not built yet (needs input from the team)

- **Ubuntu Power / Unlock logic** — waiting on Mpho's data model / insight logic
  for the "one realistic rule" that triggers Unlock
- **Marketplace offers** — schema stub exists (`offers` table), no routes yet —
  If Time tier, build after the vertical slice works end-to-end
- **Roles beyond member/admin** — schema supports it, not enforced in routes yet

## Audit trail

Every register/login/group-create/join/contribution writes to `audit_log` —
covers the "auth, roles & audit trail demonstrable" Done Means criteria.

## Connecting the frontend (Lovable)

Point the frontend's API base URL at wherever this is deployed (or
`http://localhost:4000` for local dev). Replace any mock/placeholder data
calls in the Lovable-generated code with real fetches to these endpoints.
