import type { Metadata } from "next"
import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PublicHeader } from "@/components/public-header"

export const metadata: Metadata = {
  title: "MySQL Automated Email Reports — Query2Mail",
  description:
    "Connect your MySQL database and schedule SQL queries that automatically deliver formatted Excel reports via email. No scripts to maintain, no dashboards to build.",
  alternates: { canonical: "/integrations/mysql" },
  openGraph: {
    title: "MySQL Automated Email Reports — Query2Mail",
    description:
      "Schedule MySQL queries to run automatically and email formatted Excel reports to your stakeholders. Set up in minutes.",
    url: "https://query2mail.com/integrations/mysql",
  },
}

const useCases = [
  "Daily order summaries emailed to your operations team",
  "Weekly sales performance reports sent to account managers",
  "Monthly user growth metrics delivered to leadership",
  "Real-time inventory alerts sent to warehouse teams",
  "Support queue depth reports emailed every morning",
]

const steps = [
  {
    number: "01",
    title: "Add your MySQL connection",
    body: "Enter your host, port, database name, and credentials. Query2Mail encrypts them immediately with AES-256 — credentials are never stored or transmitted in plaintext.",
  },
  {
    number: "02",
    title: "Write your SQL query",
    body: "Paste any SELECT query. Joins, subqueries, stored procedure calls — anything your MySQL instance can run, Query2Mail can schedule.",
  },
  {
    number: "03",
    title: "Set a schedule and add recipients",
    body: "Pick daily, weekly, or monthly. Add recipient email addresses. No accounts needed for recipients — they just receive Excel files in their inbox.",
  },
  {
    number: "04",
    title: "Reports run themselves",
    body: "At the scheduled time, Query2Mail connects to your MySQL instance, executes your query, formats the output into Excel, and emails it automatically.",
  },
]

export default function MySQLPage() {
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
            MySQL Integration
          </p>
          <h1 className="mb-6 font-heading text-4xl font-medium leading-tight tracking-tight text-foreground sm:text-5xl">
            MySQL scheduled reports,
            <br />
            <span className="text-primary">emailed automatically.</span>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-muted-foreground">
            Stop exporting CSVs manually and pasting them into Excel. Schedule any MySQL query,
            and Query2Mail handles the rest — formatted Excel, delivered on time, every time.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/login">Connect MySQL free →</Link>
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
            Running in four steps.
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
          <p className="mb-2 text-muted-foreground/60">-- Example: daily orders by channel</p>
          <p>
            <span className="text-primary">SELECT</span>
            <span className="text-foreground"> channel, COUNT(*) AS orders, SUM(total) AS revenue</span>
          </p>
          <p>
            <span className="text-primary">FROM</span>
            <span className="text-foreground"> orders</span>
          </p>
          <p>
            <span className="text-primary">WHERE</span>
            <span className="text-foreground"> created_at &gt;= DATE_SUB(NOW(), INTERVAL 1 DAY)</span>
          </p>
          <p>
            <span className="text-primary">GROUP BY</span>
            <span className="text-foreground"> channel</span>
          </p>
          <p>
            <span className="text-primary">ORDER BY</span>
            <span className="text-foreground"> revenue </span>
            <span className="text-primary">DESC</span>
            <span className="text-foreground">;</span>
          </p>
          <p className="mt-4 text-muted-foreground/40">
            → Runs daily at 7:00 AM → Excel emailed to ops@company.com
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
          Your MySQL database. Any inbox.
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
