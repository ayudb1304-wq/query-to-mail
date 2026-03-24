# Query2Mail — MVP Build Plan

## Stack Decision

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | Full-stack, API routes, Vercel-native |
| UI | shadcn/ui + Tailwind CSS | Accessible, composable, unstyled base |
| Database (app) | Supabase (Postgres) | Schedules, connections, job logs, auth |
| File Storage | Supabase Storage | Large Excel fallback, signed URLs |
| Email | Resend | Simple API, great DX, free tier |
| Scheduling | Vercel Cron Jobs | Native cron support, zero infra |
| Encryption | AES-256-GCM (Node crypto) | Encrypt DB credentials at rest |
| Excel | ExcelJS | Streaming row-by-row generation |
| Hosting | Vercel | Zero-config, pairs with Next.js |

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
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK | Supabase auth |
| name | text | Display name |
| db_type | enum | `postgres` \| `mysql` |
| host | text | |
| port | int | |
| database_name | text | |
| username_enc | text | AES-256 encrypted |
| password_enc | text | AES-256 encrypted |
| created_at | timestamptz | |

### `query_jobs`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK | |
| connection_id | uuid FK | |
| name | text | Job display name |
| sql_query | text | Raw SQL (read-only enforced) |
| cron_expression | text | e.g. `0 8 * * 1` |
| recipients | text[] | Email list |
| is_active | bool | Enable/disable |
| last_run_at | timestamptz | |
| next_run_at | timestamptz | Computed on save |
| created_at | timestamptz | |

### `job_logs`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| job_id | uuid FK | |
| status | enum | `success` \| `failed` \| `running` |
| rows_returned | int | |
| file_size_bytes | int | |
| delivery_method | enum | `attachment` \| `link` |
| error_message | text | null on success |
| executed_at | timestamptz | |

---

## Phase Plan

### Phase 0 — Project Setup (Day 1)
- [ ] Init Next.js 14 app with TypeScript, Tailwind, shadcn/ui
- [ ] Configure Supabase project: create tables, enable Row Level Security
- [ ] Set up Supabase Auth (magic link or GitHub OAuth)
- [ ] Configure environment variables: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`, `RESEND_API_KEY`, `ENCRYPTION_KEY`
- [ ] Set up Vercel project, link to GitHub repo
- [ ] Configure `vercel.json` with cron job: `GET /api/cron` every minute

---

### Phase 1 — Landing Page (Days 1–2)

**Goal:** Sell the *pain*, not the product. Dark, dramatic, premium.

**Page structure (single scrolling page):**

#### Section 1 — Hero
- Headline (emotional, not feature-driven):
  > "Your stakeholders don't need a dashboard. They need the answer in their inbox."
- Sub-headline:
  > "Query2Mail runs your SQL on a schedule and delivers perfectly formatted Excel reports — automatically. No login required for recipients. No BI platform. No meetings about the dashboard."
- CTA: `Get Early Access` → email capture form (saves to Supabase `waitlist` table)
- Background: dark (`zinc-950`), subtle grid or noise texture

#### Section 2 — Problem (The Pain)
- Emotional copy targeting the data engineer:
  > "You've written the Python script. You've set up the cron job. You've handled the SMTP config. You've fixed the broken pandas export at 7am on a Monday. Again."
- Three pain cards: **The BI Platform Nobody Uses**, **The Fragile Script**, **The Friday Inbox Panic**

#### Section 3 — How It Works (3 steps, no jargon)
1. Connect your database (read-only)
2. Write your query, set a schedule
3. Your stakeholders get an Excel file in their inbox

#### Section 4 — Social Proof / Positioning
- "Built for data engineers who are tired of being accidental BI developers."
- Pull quote style testimonial placeholder

#### Section 5 — Pricing (simple)
- Two cards: `Starter $29/mo` and `Pro $79/mo`
- Feature comparison table (minimal)

#### Section 6 — CTA Footer
- Repeat headline + email capture

**Components to use (shadcn):** `Button`, `Card`, `Input`, `Badge`, `Separator`

---

### Phase 2 — Auth & Dashboard Shell (Day 2)

- Supabase Auth integration (magic link email)
- Protected `/dashboard` route via Next.js middleware
- Dashboard layout: sidebar nav (shadcn `Sheet` on mobile)
- Nav items: Connections, Query Jobs, Logs, Settings
- Empty states for each section with clear CTAs

---

### Phase 3 — Connection Manager (Days 3–4)

**API routes:**
- `POST /api/connections` — create, encrypt credentials with AES-256-GCM
- `GET /api/connections` — list for user
- `DELETE /api/connections/:id`
- `POST /api/connections/:id/test` — test live connection (returns success/error)

**UI:**
- Connection list page with status badges
- "New Connection" modal: shadcn `Dialog` with form (`Input`, `Select` for db type, `Button`)
- Test connection button with live feedback (`toast` on success/error)

**Security:**
- Credentials encrypted with `AES-256-GCM` before write
- Decrypted only inside server-side API routes, never sent to client
- Connections marked as `read_only: true` enforced at query execution

---

### Phase 4 — Query Editor + Scheduler (Days 4–5)

**UI:**
- "New Job" page: multi-step form
  1. Pick a connection (dropdown)
  2. Write SQL — monospaced `<textarea>` (shadcn `Textarea` + custom font)
  3. Set schedule — human-friendly picker (Daily, Weekly, Monthly) that maps to cron string
  4. Add recipient emails — tag input (comma-separated)
  5. Job name + save

**Cron helper:** Map UI selections → cron expressions
- Daily at time → `0 HH * * *`
- Weekly (day + time) → `0 HH * * D`
- Monthly (day + time) → `0 HH DD * *`

**API routes:**
- `POST /api/queries` — create job, compute `next_run_at`
- `GET /api/queries` — list
- `PATCH /api/queries/:id` — update (toggle active, edit)
- `DELETE /api/queries/:id`
- `POST /api/queries/:id/run` — manual trigger

---

### Phase 5 — Execution Engine (Days 5–7) ⚠️ Critical

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

### Phase 6 — Email Delivery (Day 7)

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

### Phase 7 — Large Payload Fallback (Day 7–8)

- Supabase Storage bucket: `reports` (private bucket)
- Upload path: `{user_id}/{job_id}/{timestamp}.xlsx`
- Generate signed URL: `storage.from('reports').createSignedUrl(path, 172800)` (48h)
- Store signed URL in `job_logs` for audit trail
- Cleanup: Supabase Storage lifecycle policy or a weekly cron to delete files older than 7 days

---

### Phase 8 — Logs & Dashboard Polish (Day 8–9)

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
