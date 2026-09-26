
# Ubuntu Pay

A digital stokvel (community savings group) manager built for GKHACK26.

Ubuntu Pay lets a group create a shared savings goal, track contributions,
and unlock real local merchant offers as their balance grows — turning
informal community saving into visible, collective spending power.

**Live app:** https://ubuntu-pay-ten.vercel.app/

## How it works

1. **Create or join a stokvel** — set a name, a savings target, and a timeframe
2. **Contribute** — upload a proof of payment; an AI verification step checks
   it's genuine before the balance updates
3. **Track progress** — see the group's saved amount, target, and member status
   on the dashboard
4. **Unlock offers** — as the group's balance crosses each merchant's threshold,
   real local offers unlock in the Marketplace

## Tech stack

- **Frontend:** React + TypeScript, deployed on Vercel
- **Backend:** Supabase (Postgres database, Deno edge functions)
- **AI verification:** Google Gemini 2.5 Flash, used to detect genuine vs.
  fake/edited proof-of-payment receipts before a contribution is confirmed
- **Auth:** Supabase Auth (email + password)

## Project structure

- `src/pages` — app screens (Setup, Home, Pay, Offers, Reports, Settings)
- `src/components` — shared UI components
- `supabase/functions` — edge functions:
  - `create-group`, `join-group` — stokvel creation and membership
  - `group-dashboard` — balance, target, progress, member count
  - `submit-contribution` — runs receipt verification, records the payment
  - `contribution-history` — payment history with running balance
  - `verify-receipt` — AI-powered proof-of-payment verification
  - `demo-login` — demo account shortcut for presentations

## Local development

```bash
npm install
npm run dev
```

Requires a `.env` file with:
