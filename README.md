# IndisStack Support

A single-page app for IndisStack's AI customer-support classifier — Hindi, Hinglish, and English messages analyzed into structured, auditable outputs.

## Setup

```bash
npm install
```

Copy `.env.example` to `.env.local` and configure as needed:

```bash
cp .env.example .env.local
```

Never commit API keys or the Supabase service role key. `.env.local` is ignored by git.

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

```bash
npm run build
npm start
```

## Support Inbox

Open [/inbox](http://localhost:3000/inbox) for the **Support Inbox** demo workspace — review Hindi, Hinglish, and English customer messages, inspect deterministic IndisStack analysis, and approve, escalate, resolve, or reply to tickets.

### Inbox persistence modes

**Local demo (default)** — If Supabase is not configured, tickets load from static demo data with changes saved to `localStorage`. No database required.

**Supabase (in progress)** — The production database schema is defined in `supabase/migrations/`. The inbox UI still uses local demo data and `localStorage` until the repository layer is wired to the new tables.

### Demo mode

Set in `.env.local`:

```
NEXT_PUBLIC_DEMO_MODE=true
```

When enabled:

- The message analyzer uses deterministic local demo analysis and does not call `/api/analyze`.
- The inbox uses local demo data and `localStorage` only (no Supabase API calls).
- Output is labeled **“Demo output — deterministic preview”**.

## Supabase database setup

### 1. Create a project

Create a [Supabase](https://supabase.com) project and copy your project URL and keys.

### 2. Configure environment variables

Add to `.env.local` (see `.env.example`):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

- `NEXT_PUBLIC_*` values are safe for browser/client code (anon key only).
- `SUPABASE_SERVICE_ROLE_KEY` is **server-only** — never expose it in client bundles or `NEXT_PUBLIC_*` variables.

### 3. Apply the schema migration

In the Supabase SQL editor (or via Supabase CLI), run:

```
supabase/migrations/20250815161000_support_inbox_schema.sql
```

This creates:

| Table | Purpose |
|-------|---------|
| `tickets` | Customer, preview, channel, language, priority, status, timestamps |
| `messages` | Conversation messages per ticket |
| `analyses` | Deterministic AI analysis per ticket |

**Statuses:** `unresolved`, `resolved`, `escalated`  
**Priorities:** `low`, `medium`, `high`  
**Sender types:** `customer`, `agent`, `system`  
**Confidence:** `0`–`100` on `analyses`

The migration uses `CREATE TABLE IF NOT EXISTS` and does **not** drop existing tables.

> **Legacy note:** An earlier dev migration (`20250815000000_inbox_schema.sql`) is deprecated. If you already applied it on the same project, use a fresh Supabase database or rename legacy tables before applying the production schema.

### 4. Seed demo data

After the schema migration, run the seed file manually:

```
supabase/seed.sql
```

The seed:

- Inserts 7 demo tickets (Rahul Mehta through James Wilson) with realistic messages and analyses
- **Skips automatically** if any row already exists in `tickets` (safe to re-run; will not overwrite data)
- Does not `DROP` or `TRUNCATE` anything

### 5. Row Level Security

RLS is **enabled** on `tickets`, `messages`, and `analyses`.

There are **no permissive public policies** — anonymous and authenticated clients cannot read or write inbox data until workspace authorization is implemented.

Server-side code using `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS and is the only supported access path for now.

## Analysis modes

### Live API mode

When `OPENAI_API_KEY` is configured and the OpenAI project has available quota, **Analyze message** calls `/api/analyze`, which uses the OpenAI Responses API (`gpt-5-mini`) on the server. The API key is never exposed to the browser.

### Local demo mode

If the live API returns a quota or billing failure, the UI automatically falls back to a **deterministic local preview** so the product can still be demonstrated at no cost. Demo output is clearly labeled **“Demo output — deterministic preview”** and is not presented as a live model result.

Demo mode uses keyword-based rules and fixed outputs for the built-in example messages. Other API errors (auth, rate limits, server failures) still show safe error messages and do not fall back silently.

## Deployment

For public demo deployments without OpenAI API billing or Supabase:

```
NEXT_PUBLIC_DEMO_MODE=true
```

Do not expose or commit `OPENAI_API_KEY` or `SUPABASE_SERVICE_ROLE_KEY`. For local development with live analysis, keep secrets in `.env.local` only and leave `NEXT_PUBLIC_DEMO_MODE` unset or `false`.
