# Query2Mail — SEO Optimization Plan

> **App:** Query2Mail — SQL to Excel, automatically
> **Stack:** Next.js 16 (App Router), React 19, Supabase, Vercel
> **Target audience:** Lead Data Engineers, DBAs, IT Operations Managers (50–500 person companies)
> **Status:** Pre-launch / Early access phase

---

## Executive Summary

Query2Mail has a strong value proposition and clean technical foundation but minimal SEO infrastructure. The landing page copy is well-written and keyword-rich by nature, but zero structured signals (sitemap, OG tags, schema.org, robots directives) are in place. This plan covers everything needed to go from invisible to indexable.

---

## 1. Keyword Strategy

### Primary Keywords (High Intent)

| Keyword                           | Intent     | Difficulty | Priority |
| --------------------------------- | ---------- | ---------- | -------- |
| sql to excel automation           | Commercial | Medium     | P0       |
| scheduled sql reports email       | Commercial | Low        | P0       |
| automated database reporting tool | Commercial | Medium     | P0       |
| send sql query results by email   | Commercial | Low        | P0       |
| sql report scheduler              | Commercial | Low        | P0       |

### Secondary Keywords (Informational / Long-Tail)

| Keyword                                 | Intent        | Difficulty | Priority |
| --------------------------------------- | ------------- | ---------- | -------- |
| replace python cron job reporting       | Informational | Very Low   | P1       |
| postgresql automated excel reports      | Informational | Low        | P1       |
| mysql scheduled email reports           | Informational | Low        | P1       |
| database reporting without power bi     | Informational | Low        | P1       |
| data engineer automation tools          | Informational | Medium     | P1       |
| stakeholder reporting without dashboard | Informational | Very Low   | P1       |
| excel report from sql query             | Informational | Low        | P1       |

### Negative / Competitor Displacement Keywords

- "power bi alternative for small teams"
- "tableau too expensive alternative"
- "looker alternative no dashboards"
- "excel report automation without VBA"

### Keyword Placement Map

| Page                    | Primary Keyword              | Secondary Keywords                              |
| ----------------------- | ---------------------------- | ----------------------------------------------- |
| `/` (H1)                | sql to excel automation      | scheduled reports, email delivery, no dashboard |
| `/` (meta description)  | sql report scheduler         | database reporting, data engineer tool          |
| Future `/features` page | automated database reporting | postgresql, mysql, excel                        |
| Future `/blog/*` posts  | long-tail variations         | use cases, how-tos                              |

---

## 2. Technical SEO

### 2.1 `robots.txt`

**Action:** Create `/public/robots.txt`

```txt
User-agent: *
Allow: /
Disallow: /dashboard/
Disallow: /api/

Sitemap: https://query2mail.com/sitemap.xml
```

**Why:** Prevents crawlers from wasting crawl budget on auth-protected `/dashboard/*` routes and internal API endpoints.

---

### 2.2 `sitemap.xml`

**Action:** Create `/app/sitemap.ts` (Next.js dynamic sitemap)

```ts
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://query2mail.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://query2mail.com/login',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    // Add future public pages here:
    // /features, /pricing, /blog/*, /about, /privacy, /terms
  ]
}
```

---

### 2.3 `noindex` on Dashboard Pages

**Action:** Add robots meta to all `/dashboard` layouts to prevent indexing of authenticated pages.

```ts
// app/dashboard/layout.tsx
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}
```

Apply to: `/dashboard`, `/dashboard/connections`, `/dashboard/jobs`, `/dashboard/logs`, `/dashboard/settings`

---

### 2.4 Canonical Tags

**Action:** Add canonical URL to root layout and each public page's metadata.

```ts
// app/layout.tsx
export const metadata: Metadata = {
  // ... existing fields
  alternates: {
    canonical: 'https://query2mail.com',
  },
}
```

---

### 2.5 Favicon & App Icons

**Action:** Ensure the favicon suite is complete. The black-and-yellow bird logo (phoenix/eagle) should be exported as:

- `app/favicon.ico` — 32×32 (already exists, verify)
- `app/apple-icon.png` — 180×180 (for iOS bookmarks)
- `app/icon.png` — 512×512 (for PWA / Google Search)
- `public/og-image.png` — 1200×630 (for Open Graph, see below)

The current logo (black bird silhouette on yellow circle) works well at small sizes — high contrast, no text, distinctive shape.

---

## 3. On-Page SEO

### 3.1 Landing Page Meta Tags

**Action:** Expand `/app/layout.tsx` metadata to full OG + Twitter shape.

```ts
export const metadata: Metadata = {
  title: {
    default: 'Query2Mail — SQL to Excel, Automatically',
    template: '%s | Query2Mail',
  },
  description:
    'Run SQL on a schedule. Deliver formatted Excel reports to any inbox. No BI platform. No dashboards. No logins for recipients.',
  keywords: [
    'sql to excel automation',
    'scheduled sql reports',
    'email database reports',
    'automated reporting tool',
    'sql report scheduler',
    'postgresql excel reports',
    'mysql scheduled email',
  ],
  authors: [{ name: 'Query2Mail' }],
  creator: 'Query2Mail',
  metadataBase: new URL('https://query2mail.com'),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://query2mail.com',
    siteName: 'Query2Mail',
    title: 'Query2Mail — SQL to Excel, Automatically',
    description:
      'Run SQL on a schedule and deliver formatted Excel reports to any inbox. No BI platform. No dashboards. No logins for recipients.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Query2Mail — SQL to Excel, automatically',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Query2Mail — SQL to Excel, Automatically',
    description:
      'Run SQL on a schedule. Deliver formatted Excel to any inbox. No BI platform needed.',
    images: ['/og-image.png'],
    creator: '@query2mail', // update with real handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}
```

---

### 3.2 Open Graph Image

**Action:** Create `/public/og-image.png` at 1200×630px.

**Design spec:**

- Background: near-black (`#111`)
- Logo: bird mark (yellow circle + black eagle) — left-aligned, ~180px
- Headline: "SQL to Excel, automatically" — large white Geist Mono type
- Subline: "Connect your DB. Write a query. Set a schedule. Done." — gray smaller text
- Yellow accent stripe or glow matching brand colors
- URL watermark: `query2mail.com` bottom-right, muted

This image appears when links are shared on Slack, Twitter/X, LinkedIn, Discord, iMessage.

---

### 3.3 H1 / Heading Optimization

**Current H1:** "Your stakeholders don't need a dashboard. They need the answer in their inbox."

**Assessment:** Compelling copy, but not keyword-optimized. Consider either:

1. Keeping emotional H1 and adding a keyword-rich visible subtitle (preferred — preserves conversion copy)
2. Adjusting to something like: "Automated SQL Reports, Delivered to Any Inbox"

**Recommended approach:** Keep current H1. Add an invisible `<h2>` (visually styled as subtitle) with keyword targeting:

> "Schedule SQL queries to run automatically and email Excel reports — no BI platform, no dashboards, no manual exports."

This is already close to existing subheading copy — minor keyword tuning is enough.

---

### 3.4 Page Title Templates

Update metadata for all public-facing pages:

| Route                   | Title                                      |
| ----------------------- | ------------------------------------------ |
| `/`                     | `Query2Mail — SQL to Excel, Automatically` |
| `/login`                | `Sign In — Query2Mail`                     |
| `/features` (future)    | `Features — Query2Mail`                    |
| `/pricing` (future)     | `Pricing — Query2Mail`                     |
| `/blog` (future)        | `Blog — Query2Mail`                        |
| `/blog/[slug]` (future) | `{Post Title} — Query2Mail`                |
| `/privacy`              | `Privacy Policy — Query2Mail`              |
| `/terms`                | `Terms of Service — Query2Mail`            |

---

## 4. Structured Data (JSON-LD)

### 4.1 Organization Schema

**Action:** Add to root layout or landing page component.

```ts
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Query2Mail',
  url: 'https://query2mail.com',
  logo: 'https://query2mail.com/icon.png',
  description:
    'Automated SQL-to-Excel reporting. Run queries on a schedule, deliver formatted Excel files to any inbox.',
  sameAs: [
    'https://twitter.com/query2mail', // update with real accounts
  ],
}
```

### 4.2 SoftwareApplication Schema

```ts
const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Query2Mail',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'SQL report scheduler that runs database queries on a schedule and delivers formatted Excel reports via email. Supports PostgreSQL and MySQL.',
  url: 'https://query2mail.com',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free to start. Paid tiers coming soon.',
  },
  featureList: [
    'Scheduled SQL query execution',
    'Automated Excel report generation',
    'Email report delivery',
    'PostgreSQL and MySQL support',
    'No dashboard required',
  ],
}
```

### 4.3 FAQ Schema (for landing page FAQ section — to be created)

```ts
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Does my stakeholder need to log in to receive reports?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Reports are delivered directly to their inbox as Excel attachments. They never touch Query2Mail.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which databases does Query2Mail support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Query2Mail currently supports PostgreSQL and MySQL. More database types are on the roadmap.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is my database connection secured?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'All database credentials are encrypted with AES-256 before storage. Connections are never exposed client-side.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does the free plan include?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Query2Mail is free to start. Early adopters lock in 2 months free plus discounted pricing when paid tiers launch.',
      },
    },
  ],
}
```

**Implementation:** Add via `<Script type="application/ld+json">` in the relevant page component or layout.

---

## 5. Content & Pages to Create

### 5.1 Legal Pages (Required — High Priority)

These are blocking trust signals and required by most app stores, ad platforms, and compliance frameworks.

| Page       | Priority | Notes                                          |
| ---------- | -------- | ---------------------------------------------- |
| `/privacy` | P0       | GDPR/CCPA required; needed before any paid ads |
| `/terms`   | P0       | Required before public launch                  |

---

### 5.2 FAQ Section on Landing Page

**Action:** Add collapsible FAQ section above footer on `/`.

**Why:** FAQ sections with `FAQPage` JSON-LD can earn rich results (accordion answers) directly in Google SERPs, driving CTR. Also answers pre-purchase objections.

**Suggested questions:**

1. Does my stakeholder need to log in to receive reports?
2. Which databases are supported?
3. How is my database connection secured?
4. What happens if a query fails?
5. Can I format the Excel output?
6. How is this different from PowerBI or Tableau?

---

### 5.3 Future Pages (Phase 2+)

These expand keyword surface area and create linkable assets.

| Page                          | Target Keyword                     | Priority |
| ----------------------------- | ---------------------------------- | -------- |
| `/features`                   | automated database reporting       | P1       |
| `/use-cases/data-engineers`   | data engineer automation tools     | P1       |
| `/use-cases/operations-teams` | ops reporting without BI           | P1       |
| `/integrations/postgresql`    | postgresql excel reports automated | P1       |
| `/integrations/mysql`         | mysql scheduled email reports      | P1       |
| `/compare/power-bi`           | power bi alternative               | P2       |
| `/compare/tableau`            | tableau alternative small team     | P2       |
| `/blog`                       | (content hub for long-tail)        | P2       |

---

### 5.4 Blog / Content Marketing (Phase 3)

Target informational keywords that data engineers search when frustrated with their current setup.

**High-value post ideas:**

1. "Why your team stops using the BI dashboard after 3 weeks" (pain validation)
2. "The hidden cost of maintaining a Python cron job reporting pipeline"
3. "SQL to Excel: 5 ways to automate stakeholder reporting"
4. "PostgreSQL scheduled reports: a step-by-step guide"
5. "PowerBI vs. email reports: what actually works for non-technical stakeholders"
6. "How to send MySQL query results as Excel files on a schedule"

---

## 6. Core Web Vitals & Performance

### 6.1 Current Performance Baseline

- Next.js 16 with Turbopack — fast dev builds, production output is standard Next.js
- React 19 with App Router — server components reduce JS bundle size
- No `next/image` usage detected on landing page — **potential LCP issue**
- Fonts loaded from Google Fonts (external) — small network cost

### 6.2 Actions

| Issue                           | Action                                                                                         | Impact                         |
| ------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------ |
| Images not using `next/image`   | Wrap any landing page images with `<Image>` from `next/image`                                  | LCP improvement                |
| OG image (when created)         | Serve from `/public` with proper caching headers                                               | N/A (not page-render critical) |
| Google Fonts (external)         | Self-host fonts via `next/font/google` (already partially done via CSS vars)                   | FCP improvement                |
| Animation JS                    | Ensure `useAnimatedCount` and counter animations don't block paint                             | TBT reduction                  |
| Verify Vercel deployment config | Enable Edge Network caching for `/api/waitlist/count` (already edge-cached per commit history) | TTFB                           |

### 6.3 Lighthouse Targets

| Metric         | Target |
| -------------- | ------ |
| Performance    | ≥ 90   |
| Accessibility  | ≥ 95   |
| Best Practices | ≥ 95   |
| SEO            | 100    |

---

## 7. Off-Page SEO & Link Building

### 7.1 Launch Channels (Quick Wins)

These generate initial backlinks and traffic without content creation:

| Channel                         | Action                                                            | Domain Authority   |
| ------------------------------- | ----------------------------------------------------------------- | ------------------ |
| Product Hunt                    | Launch — target "SQL automation" and "developer tools" categories | High (DA 90+)      |
| Hacker News (Show HN)           | Post when product is stable                                       | Very High (DA 90+) |
| Reddit r/dataengineering        | Share as tool, not spam — participate in community first          | Medium             |
| Reddit r/dataisbeautiful        | Share output examples                                             | Medium             |
| Dev.to / Hashnode               | Write "how I built Query2Mail" article with backlink              | Medium             |
| Indie Hackers                   | Product page + founder story                                      | Medium             |
| GitHub (if OSS or OSS-adjacent) | README with backlinks to product page                             | Medium             |
| BetaList                        | Submit for early access listing                                   | Medium             |

### 7.2 Partnership / Integration Mentions

- Supabase ecosystem (submit to Supabase integrations directory)
- Resend partner program (if available)
- Vercel marketplace / templates

---

## 8. Local & Niche SEO

Query2Mail is a developer tool, not a local business, so traditional local SEO doesn't apply. However:

- **Developer community SEO:** Optimize for queries on Stack Overflow, GitHub Discussions, Reddit — these rank in Google for long-tail developer queries
- **G2 / Capterra / Product Hunt reviews:** Create profiles to appear in "best X tool" comparison roundups (high commercial intent, high DA)

---

## 9. Google Search Console & Analytics Setup

### 9.1 Verification

**Action:** Verify `query2mail.com` in Google Search Console.

- Add `google-site-verification` meta tag to root layout, or
- Upload `google[token].html` to `/public/`

```ts
// app/layout.tsx metadata
verification: {
  google: 'your-verification-token-here',
},
```

### 9.2 Submit Sitemap

After creating `sitemap.xml`:

1. Go to Search Console → Sitemaps
2. Submit `https://query2mail.com/sitemap.xml`
3. Monitor for crawl errors

### 9.3 Analytics

- **Vercel Analytics** — already likely configured; verify page view tracking
- **Google Analytics 4 (GA4)** — set up for search traffic attribution
- **Key events to track:**
  - Waitlist form submission
  - CTA button clicks ("Start automating →")
  - Scroll depth (did they reach Pricing? FAQ? Footer CTA?)
  - Sign-up completion

---

## 10. Implementation Priority Queue

### Phase 1 — Foundation (Do First, ~1 day)

- [ ] Create `public/robots.txt`
- [ ] Create `app/sitemap.ts` (dynamic Next.js sitemap)
- [ ] Add full OG + Twitter metadata to `app/layout.tsx`
- [ ] Add `noindex` to all `/dashboard/*` layouts
- [ ] Add canonical tags to public pages
- [ ] Create `public/og-image.png` (1200×630)
- [ ] Verify favicon suite (favicon.ico, apple-icon.png, icon.png)

### Phase 2 — On-Page & Structured Data (~2-3 days)

- [ ] Add Organization + SoftwareApplication JSON-LD to landing page
- [ ] Create `/privacy` page (Privacy Policy)
- [ ] Create `/terms` page (Terms of Service)
- [ ] Add FAQ section to landing page with FAQPage JSON-LD
- [ ] Add Google Search Console verification meta tag
- [ ] Submit sitemap to Google Search Console

### Phase 3 — Content Expansion (~1-2 weeks)

- [ ] Create `/features` page with keyword-targeted copy
- [ ] Create `/integrations/postgresql` and `/integrations/mysql` pages
- [ ] Create `/use-cases/data-engineers` page
- [ ] Plan 3–5 blog posts targeting long-tail informational keywords
- [ ] Set up GA4 event tracking for key conversion events

### Phase 4 — Off-Page & Launch (~ongoing)

- [ ] Product Hunt launch
- [ ] Hacker News Show HN post
- [ ] Submit to BetaList, Indie Hackers, G2
- [ ] Write "how I built it" article on Dev.to / Hashnode
- [ ] Reddit engagement in r/dataengineering

---

## 11. Quick Reference: File Changes Needed

| File                            | Change                                                           |
| ------------------------------- | ---------------------------------------------------------------- |
| `public/robots.txt`             | Create (new file)                                                |
| `app/sitemap.ts`                | Create (new file)                                                |
| `app/layout.tsx`                | Expand metadata (OG, Twitter, keywords, robots, verification)    |
| `app/dashboard/layout.tsx`      | Add `robots: { index: false }`                                   |
| `public/og-image.png`           | Create (design asset)                                            |
| `app/apple-icon.png`            | Create (logo export)                                             |
| `app/icon.png`                  | Create (logo export)                                             |
| `app/(public)/privacy/page.tsx` | Create (new page)                                                |
| `app/(public)/terms/page.tsx`   | Create (new page)                                                |
| Landing page component          | Add JSON-LD script tags (Organization, SoftwareApplication, FAQ) |
| Landing page component          | Add FAQ section above footer CTA                                 |
