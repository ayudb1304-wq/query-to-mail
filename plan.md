# Query2Mail — MVP Build Plan

## ⚠️ Pre-Launch Removal Checklist

Things added temporarily for development that **must be removed before public launch:**

- [ ] **Dev login bypass** — delete `app/api/dev-login/route.ts` and remove the `DEV_BYPASS_EMAIL` block in `components/auth/login-form.tsx`. Replace with proper Supabase magic link (configure Site URL + redirect URLs in Supabase dashboard, add custom SMTP if needed).
- [ ] **Demo seed data** — drop the demo schema before prod launch. Run in Supabase SQL editor: `DROP SCHEMA demo CASCADE;` and delete `supabase/migrations/003_demo_schema_and_seed.sql`.

---

## Stack Decision

| Layer          | Choice                    | Reason                                 |
| -------------- | ------------------------- | -------------------------------------- |
| Framework      | Next.js 14 (App Router)   | Full-stack, API routes, Vercel-native  |
| UI             | shadcn/ui + Tailwind CSS  | Accessible, composable, unstyled base  |
| Database (app) | Supabase (Postgres)       | Schedules, connections, job logs, auth |
| File Storage   | Supabase Storage          | Large Excel fallback, signed URLs      |
| Email          | Resend                    | Simple API, great DX, free tier        |
| Scheduling     | Vercel Cron Jobs          | Native cron support, zero infra        |
| Encryption     | AES-256-GCM (Node crypto) | Encrypt DB credentials at rest         |
| Excel          | ExcelJS                   | Streaming row-by-row generation        |
| Hosting        | Vercel                    | Zero-config, pairs with Next.js        |

---

## Architecture Overview

```
User Browser
    │
    ▼
Next.js App (Vercel)
    ├── /app            → Landing page (public)
    ├── /app/dashboard  → Admin panel (authenticated)
    └── /api
         ├── /connections   → CRUD for DB connections
         ├── /queries        → CRUD for queries + schedules
         ├── /run            → Manual trigger
         └── /cron           → Called by Vercel Cron → executes due jobs

Supabase
    ├── postgres        → connections, queries, schedules, job_logs
    └── storage         → large Excel files (time-expiring signed URLs)

Resend
    └── transactional email → Excel attachment or download link

External DBs
    └── PostgreSQL / MySQL (user's databases, read-only creds)
```

---

## Database Schema (Supabase)

### `connections`

| Column        | Type        | Notes                 |
| ------------- | ----------- | --------------------- |
| id            | uuid PK     |                       |
| user_id       | uuid FK     | Supabase auth         |
| name          | text        | Display name          |
| db_type       | enum        | `postgres` \| `mysql` |
| host          | text        |                       |
| port          | int         |                       |
| database_name | text        |                       |
| username_enc  | text        | AES-256 encrypted     |
| password_enc  | text        | AES-256 encrypted     |
| created_at    | timestamptz |                       |

### `query_jobs`

| Column          | Type        | Notes                        |
| --------------- | ----------- | ---------------------------- |
| id              | uuid PK     |                              |
| user_id         | uuid FK     |                              |
| connection_id   | uuid FK     |                              |
| name            | text        | Job display name             |
| sql_query       | text        | Raw SQL (read-only enforced) |
| cron_expression | text        | e.g. `0 8 * * 1`             |
| recipients      | text[]      | Email list                   |
| is_active       | bool        | Enable/disable               |
| last_run_at     | timestamptz |                              |
| next_run_at     | timestamptz | Computed on save             |
| created_at      | timestamptz |                              |

### `job_logs`

| Column          | Type        | Notes                              |
| --------------- | ----------- | ---------------------------------- |
| id              | uuid PK     |                                    |
| job_id          | uuid FK     |                                    |
| status          | enum        | `success` \| `failed` \| `running` |
| rows_returned   | int         |                                    |
| file_size_bytes | int         |                                    |
| delivery_method | enum        | `attachment` \| `link`             |
| error_message   | text        | null on success                    |
| executed_at     | timestamptz |                                    |

---

## Phase Plan

### ~~Phase 0 — Project Setup~~ ✅ Done

- [x] Init Next.js 14 app with TypeScript, Tailwind, shadcn/ui
- [x] Configure Supabase project: create tables, enable Row Level Security (`supabase/migrations/`)
- [x] Set up Supabase Auth (magic link — configured in middleware)
- [x] Configure environment variables: `.env.example` created, `.env.local` filled by user
- [x] Set up Vercel project, link to GitHub repo
- [x] Configure `vercel.json` with cron job: `GET /api/cron` every minute
- [x] Install backend packages: Supabase SSR, Resend, ExcelJS, pg, mysql2, zod
- [x] `lib/supabase.ts` — browser, server, service role clients
- [x] `lib/crypto.ts` — AES-256-GCM encrypt/decrypt
- [x] `middleware.ts` — auth route protection

---

### ~~Phase 1 — Landing Page~~ ✅ Done

**Goal:** Sell the _pain_, not the product. Dark, dramatic, premium.

- [x] `components/landing/navbar.tsx` — fixed top nav with smooth scroll links
- [x] `components/landing/hero.tsx` — grid bg, radial glow, headline, email capture
- [x] `components/landing/waitlist-form.tsx` — client component, POST to `/api/waitlist`
- [x] `components/landing/pain-section.tsx` — three pain cards (BI nobody uses, fragile script, Friday panic)
- [x] `components/landing/how-it-works.tsx` — 3 steps + inline SQL code visual
- [x] `components/landing/pricing.tsx` — Starter $29 / Pro $79 cards
- [x] `components/landing/footer-cta.tsx` — repeat CTA + footer
- [x] `app/api/waitlist/route.ts` — POST endpoint, validates email, inserts to Supabase, handles duplicates
- [x] `app/page.tsx` — wires all sections together
- [x] `app/layout.tsx` — updated metadata (title, description)
- [x] `components/theme-provider.tsx` — default theme set to dark
- [x] shadcn components installed: Card, Input, Badge, Separator

---

### ~~Phase 2 — Auth & Dashboard Shell~~ ✅ Done

- [x] `app/login/page.tsx` — magic link sign-in page (dark, grid bg)
- [x] `components/auth/login-form.tsx` — client form, signInWithOtp, "check your inbox" state
- [x] `app/auth/callback/route.ts` — exchanges Supabase code for session, redirects to `/dashboard`
- [x] `app/dashboard/layout.tsx` — server layout, reads user session, redirects if unauthenticated
- [x] `components/dashboard/sidebar.tsx` — desktop sidebar, active nav state, user + sign out
- [x] `components/dashboard/mobile-nav.tsx` — Sheet drawer on mobile, hamburger trigger
- [x] `components/dashboard/sign-out-button.tsx` — client, calls signOut + router.push
- [x] `app/dashboard/page.tsx` — overview with 3 stat cards + empty state pipeline prompt
- [x] `app/dashboard/connections/page.tsx` — empty state, disabled "Add connection" CTA
- [x] `app/dashboard/jobs/page.tsx` — empty state, disabled "Create job" CTA
- [x] `app/dashboard/logs/page.tsx` — empty state
- [x] shadcn components installed: Sheet, Avatar, DropdownMenu, Tooltip
- [x] TooltipProvider added to root layout

---

### ~~Phase 3 — Connection Manager~~ ✅ Done

- [x] `app/api/connections/route.ts` — GET (list, safe fields only) + POST (encrypt creds, insert)
- [x] `app/api/connections/[id]/route.ts` — DELETE with ownership check
- [x] `app/api/connections/[id]/test/route.ts` — decrypts creds, opens real DB connection, runs SELECT 1
- [x] `lib/db-connector.ts` — pg + mysql2 connection factory, 5s timeout, SSL
- [x] `components/dashboard/add-connection-dialog.tsx` — Dialog form, port auto-fills by DB type
- [x] `components/dashboard/connection-list.tsx` — fetches list, empty state, delete with confirm
- [x] `components/dashboard/test-connection-btn.tsx` — live test with Connected/Failed badge
- [x] `app/dashboard/connections/page.tsx` — wired to ConnectionList component
- [x] shadcn components installed: Dialog, Select, Label, Sonner
- [x] Sonner Toaster added to root layout

---

### ~~Phase 4 — Query Editor + Scheduler~~ ✅ Done

- [x] `lib/cron-utils.ts` — buildCronExpression, cronToDescription, computeNextRunAt (cron-parser)
- [x] `app/api/queries/route.ts` — GET (list with connection join) + POST (create, compute next_run_at)
- [x] `app/api/queries/[id]/route.ts` — PATCH (toggle active, update) + DELETE
- [x] `app/api/queries/[id]/run/route.ts` — POST stub (wired in Phase 5)
- [x] `components/dashboard/create-job-form.tsx` — name, connection dropdown, SQL textarea, schedule picker (daily/weekly/monthly + time), recipient tag input with live preview
- [x] `components/dashboard/job-list.tsx` — fetches jobs, active toggle (Switch), run button, delete, cron description
- [x] `app/dashboard/jobs/page.tsx` — wired to JobList
- [x] `app/dashboard/jobs/new/page.tsx` — CreateJobForm with back link
- [x] shadcn: Textarea, Switch; cron-parser installed

---

### ~~Phase 5 — Execution Engine~~ ✅ Done

**This is the core of the product. Must be streaming, not in-memory.**

**`/api/cron` handler (called by Vercel Cron every minute):**

1. Query Supabase for all jobs where `is_active = true AND next_run_at <= NOW()`
2. For each due job: mark `status = running`, update `last_run_at`, compute next `next_run_at`
3. Spawn execution (sequential or parallel depending on load)

**Execution worker (`lib/executor.ts`):**

1. Decrypt DB credentials
2. Open connection (pg / mysql2 client)
3. Execute query as **streaming cursor** (avoid loading all rows into memory)
4. Pipe rows directly into ExcelJS `stream.xlsx.WorkbookWriter`
5. Stream Excel output to a temp buffer / Supabase Storage upload stream
6. Check final file size:
   - `< 20MB` → attach to email directly
   - `>= 20MB` → upload to Supabase Storage, generate signed URL (expires 48h)
7. Send via Resend (see Phase 6)
8. Write to `job_logs`

**Key implementation details:**

- Use `pg` with `query.stream()` or `cursor` library for streaming rows
- Use `mysql2` with `queryStream()` for MySQL
- ExcelJS `stream.xlsx.WorkbookWriter` writes row-by-row without buffering full file
- Wrap in try/catch, log all errors to `job_logs` with `status = failed`

---

### ~~Phase 6 — Email Delivery~~ ✅ Done

**Resend integration (`lib/mailer.ts`):**

**Case A — Small file (< 20MB):**

```
Subject: [Query2Mail] {Job Name} — {Date}
Body: "Please find your scheduled report attached."
Attachment: {job_name}_{date}.xlsx
```

**Case B — Large file (>= 20MB):**

```
Subject: [Query2Mail] {Job Name} — {Date} (Download Link)
Body: "Your report is ready. Due to its size, download it here:
      [Download Report] → {signed_url}
      Link expires in 48 hours."
```

- Use Resend's `attachments` API for Case A
- Use Resend's plain HTML email template for Case B (styled, branded)
- Send to all recipients in `query_jobs.recipients[]`

---

### ~~Phase 7 — Large Payload Fallback~~ ✅ Done

- Supabase Storage bucket: `reports` (private bucket)
- Upload path: `{user_id}/{job_id}/{timestamp}.xlsx`
- Generate signed URL: `storage.from('reports').createSignedUrl(path, 172800)` (48h)
- Store signed URL in `job_logs` for audit trail
- Cleanup: Supabase Storage lifecycle policy or a weekly cron to delete files older than 7 days

---

### Phase 8 — Logs & Dashboard Polish (Day 8–9) ✅ Done

**Logs page:**

- Table of recent job executions (shadcn `Table`)
- Columns: Job Name, Status (badge), Rows, File Size, Delivery Method, Time
- Expandable row for error messages
- Filter by job, status, date range

**Dashboard home:**

- Summary cards: Active Jobs, Emails Sent (last 30d), Last Run Status
- Quick-run button on each job card

---

### Phase 9 — Settings & Security Hardening (Day 9)

- Settings page: API key management (for future), account info
- Rate limiting on `/api/cron` (verify Vercel cron secret header)
- RLS policies on all Supabase tables (users only see their own data)
- SQL injection prevention: use parameterized queries only; never interpolate user input into SQL
- Enforce read-only: wrap all user queries in a BEGIN/ROLLBACK transaction
- Input validation with `zod` on all API routes

---

### Phase 10 — Waitlist + Launch (Day 10)

- Wire landing page email capture to Supabase `waitlist` table
- Resend welcome email on signup
- Deploy to Vercel production
- Configure custom domain
- Set up Vercel Cron in production (`vercel.json`)

---

## File & Folder Structure

```
query2mail/
├── app/
│   ├── page.tsx                  ← Landing page
│   ├── layout.tsx
│   ├── dashboard/
│   │   ├── layout.tsx            ← Auth guard + sidebar
│   │   ├── page.tsx              ← Dashboard home
│   │   ├── connections/
│   │   │   └── page.tsx
│   │   ├── jobs/
│   │   │   ├── page.tsx
│   │   │   └── new/page.tsx
│   │   └── logs/
│   │       └── page.tsx
│   └── auth/
│       └── callback/route.ts     ← Supabase auth callback
├── api/
│   ├── connections/route.ts
│   ├── connections/[id]/route.ts
│   ├── connections/[id]/test/route.ts
│   ├── queries/route.ts
│   ├── queries/[id]/route.ts
│   ├── queries/[id]/run/route.ts
│   └── cron/route.ts             ← Vercel Cron entry point
├── lib/
│   ├── supabase.ts               ← Supabase client (server + browser)
│   ├── crypto.ts                 ← AES-256-GCM encrypt/decrypt
│   ├── executor.ts               ← Core streaming execution engine
│   ├── mailer.ts                 ← Resend integration
│   ├── excel.ts                  ← ExcelJS streaming builder
│   ├── db-connector.ts           ← pg + mysql2 connection factory
│   └── cron-utils.ts             ← Cron string builder + next_run_at calculator
├── components/
│   ├── landing/                  ← Landing page sections
│   ├── dashboard/                ← Dashboard UI components
│   └── ui/                       ← shadcn generated components
├── middleware.ts                 ← Auth route protection
└── vercel.json                   ← Cron config
```

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ENCRYPTION_KEY=                   # 32-byte random hex for AES-256
RESEND_API_KEY=
CRON_SECRET=                      # Vercel cron auth header
```

---

## MVP Definition of Done

- [ ] Landing page live with email capture
- [ ] User can sign up, log in, and reach dashboard
- [ ] User can add a PostgreSQL or MySQL connection and test it
- [ ] User can write a SQL query, schedule it, and add recipients
- [ ] Vercel Cron executes due jobs automatically
- [ ] Excel file emailed as attachment for small results
- [ ] Signed download link emailed for large results (>20MB)
- [ ] Job execution logged with status and metadata
- [ ] All credentials encrypted at rest
- [ ] User data isolated via RLS
- [ ] Deployed to Vercel with custom domain

---

## Out of Scope (Do Not Build)

- Charts, graphs, pivot tables, dashboards
- Multi-user team accounts or role-based permissions
- PDF export
- NoSQL database support
- Complex query builder UI (raw SQL only)
- Real-time collaboration
