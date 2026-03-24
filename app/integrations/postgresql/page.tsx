import type { Metadata } from "next"
import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PublicHeader } from "@/components/public-header"

export const metadata: Metadata = {
  title: "PostgreSQL Automated Excel Reports — Query2Mail",
  description:
    "Connect your PostgreSQL database and schedule SQL queries that automatically deliver formatted Excel reports to any inbox. No BI platform required.",
  alternates: { canonical: "/integrations/postgresql" },
  openGraph: {
    title: "PostgreSQL Automated Excel Reports — Query2Mail",
    description:
      "Schedule PostgreSQL queries to run automatically and email formatted Excel reports to your stakeholders. Set up in minutes.",
    url: "https://query2mail.com/integrations/postgresql",
  },
}

const useCases = [
  "Weekly revenue reports emailed to your finance team",
  "Daily active user counts sent to product managers",
  "Monthly churn summaries delivered to executives",
  "Inventory snapshots sent to operations every morning",
  "Support ticket volumes emailed to team leads on Mondays",
]

const steps = [
  {
    number: "01",
    title: "Add your PostgreSQL connection",
    body: "Enter your host, port, database name, and credentials. Query2Mail encrypts them with AES-256 immediately — they're never stored in plaintext.",
  },
  {
    number: "02",
    title: "Write your SQL query",
    body: "Paste any SELECT query. Use any PostgreSQL feature — window functions, CTEs, JSON aggregation. If it runs in psql, it runs here.",
  },
  {
    number: "03",
    title: "Set a schedule and add recipients",
    body: "Choose daily, weekly, or monthly. Add the email addresses of anyone who should receive the report. They need no account.",
  },
  {
    number: "04",
    title: "Excel lands in their inbox",
    body: "At the scheduled time, Query2Mail runs your query against your PostgreSQL instance, formats the results into a clean Excel file, and sends it automatically.",
  },
]

export default function PostgreSQLPage() {
  return (
    <div className="min-h-svh bg-background">
      <PublicHeader />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-24 pt-32">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className="h-[400px] w-[400px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, oklch(0.795 0.184 86.047) 0%, transparent 70%)" }}
          />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-4 font-heading text-xs tracking-widest text-primary uppercase">
            PostgreSQL Integration
          </p>
          <h1 className="mb-6 font-heading text-4xl font-medium leading-tight tracking-tight text-foreground sm:text-5xl">
            Automated PostgreSQL reports,
            <br />
            <span className="text-primary">delivered to any inbox.</span>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-muted-foreground">
            Schedule any PostgreSQL query to run on a cadence and email the results as a formatted
            Excel file. Your stakeholders get fresh data without logging into anything.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/login">Connect PostgreSQL free →</Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link href="/features">See all features</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-16 text-center">
          <p className="mb-4 font-heading text-xs tracking-widest text-primary uppercase">
            Setup
          </p>
          <h2 className="font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Connected in four steps.
          </h2>
        </div>

        <div className="relative">
          <div className="absolute top-6 left-0 right-0 hidden h-px bg-gradient-to-r from-transparent via-white/10 to-transparent sm:block" />
          <div className="grid gap-8 sm:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                  <span className="font-heading text-xs font-medium text-primary">{step.number}</span>
                </div>
                <h3 className="font-heading text-sm font-medium text-foreground">{step.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code example */}
      <section className="mx-auto max-w-4xl px-6 py-8">
        <div className="rounded-xl border border-white/8 bg-card/50 p-6 font-mono text-xs">
          <p className="mb-2 text-muted-foreground/60">-- Example: weekly revenue by region</p>
          <p>
            <span className="text-primary">SELECT</span>
            <span className="text-foreground"> region, SUM(revenue) AS total_revenue, COUNT(*) AS orders</span>
          </p>
          <p>
            <span className="text-primary">FROM</span>
            <span className="text-foreground"> sales</span>
          </p>
          <p>
            <span className="text-primary">WHERE</span>
            <span className="text-foreground"> created_at &gt;= date_trunc(</span>
            <span className="text-primary">&apos;week&apos;</span>
            <span className="text-foreground">, now())</span>
          </p>
          <p>
            <span className="text-primary">GROUP BY</span>
            <span className="text-foreground"> region</span>
          </p>
          <p>
            <span className="text-primary">ORDER BY</span>
            <span className="text-foreground"> total_revenue </span>
            <span className="text-primary">DESC</span>
            <span className="text-foreground">;</span>
          </p>
          <p className="mt-4 text-muted-foreground/40">
            → Runs every Monday 8:00 AM → Excel emailed to finance@company.com
          </p>
        </div>
      </section>

      {/* Use cases */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <div className="mb-12 text-center">
          <p className="mb-4 font-heading text-xs tracking-widest text-primary uppercase">
            Use cases
          </p>
          <h2 className="font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            What teams use it for
          </h2>
        </div>
        <ul className="space-y-3">
          {useCases.map((uc) => (
            <li key={uc} className="flex items-center gap-3 rounded-lg border border-white/8 bg-card/50 px-5 py-4">
              <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span className="text-sm text-muted-foreground">{uc}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 px-6 py-24 text-center">
        <h2 className="mb-4 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
          Your PostgreSQL database. Any inbox.
        </h2>
        <p className="mb-8 text-sm text-muted-foreground">
          Free to start. No credit card required.
        </p>
        <Button size="lg" asChild>
          <Link href="/login">Connect your database →</Link>
        </Button>
      </section>
    </div>
  )
}
