# Query2Mail

Schedule SQL queries against PostgreSQL or MySQL, generate formatted Excel reports, and deliver them by email—without turning your team into accidental BI maintainers.

**Live:** [query-to-mail.vercel.app](https://query-to-mail.vercel.app) · **Repo:** [github.com/ayudb1304-wq/query-to-mail](https://github.com/ayudb1304-wq/query-to-mail)

## Stack

- [Next.js](https://nextjs.org/) (App Router) + TypeScript
- [Supabase](https://supabase.com/) (auth & database)
- [shadcn/ui](https://ui.shadcn.com/) + Tailwind CSS
- [Resend](https://resend.com/) for transactional email
- [ExcelJS](https://github.com/exceljs/exceljs) for report files

## Getting started

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables and fill in real values:

   ```bash
   cp .env.example .env.local
   ```

   See `.env.example` for Supabase keys, `ENCRYPTION_KEY` (AES-256-GCM for connection secrets), Resend, optional `CRON_SECRET` for Vercel Cron, and optional GA4.

3. Run the dev server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Dev server (Turbopack)   |
| `npm run build`   | Production build         |
| `npm run start`   | Start production server  |
| `npm run lint`    | ESLint                   |
| `npm run typecheck` | TypeScript check       |
| `npm run format`  | Prettier (TS/TSX)        |

## UI components

This project uses shadcn/ui. To add a component:

```bash
npx shadcn@latest add button
```

Import from `@/components/ui/...` as usual.
