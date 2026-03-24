import type { Metadata } from "next"
import Link from "next/link"
import { Check, Shield, Clock, Mail, Database, FileSpreadsheet, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PublicHeader } from "@/components/public-header"

export const metadata: Metadata = {
  title: "Features — Automated Database Reporting",
  description:
    "Schedule SQL queries, generate formatted Excel reports, and deliver them to any inbox automatically. No BI platform, no dashboards, no maintenance.",
  alternates: { canonical: "/features" },
  openGraph: {
    title: "Features — Query2Mail",
    description:
      "Everything you need to automate stakeholder reporting: SQL scheduling, Excel generation, email delivery, and encrypted database connections.",
    url: "https://query2mail.com/features",
  },
}

const features = [
  {
    icon: Clock,
    title: "Flexible scheduling",
    description:
      "Run queries daily, weekly, or monthly on a schedule you set. Minute-level scheduling available on Pro. Set it once and forget it.",
  },
  {
    icon: FileSpreadsheet,
    title: "Auto-formatted Excel output",
    description:
      "Results are rendered into clean, properly typed Excel files. Dates, numbers, and strings are formatted automatically — no manual cleanup needed.",
  },
  {
    icon: Mail,
    title: "Direct inbox delivery",
    description:
      "Reports land directly in your stakeholders' inboxes as Excel attachments. No login, no dashboard, no action required from recipients.",
  },
  {
    icon: Database,
    title: "PostgreSQL & MySQL support",
    description:
      "Connect any PostgreSQL or MySQL database in minutes using standard credentials. Read-only connections recommended for reporting.",
  },
  {
    icon: Shield,
    title: "AES-256 encrypted credentials",
    description:
      "Database credentials are encrypted with AES-256 before storage and never exposed client-side. Your connection details stay private.",
  },
  {
    icon: Activity,
    title: "Execution logs",
    description:
      "Every job run is logged with status, duration, and any errors. Debug failed queries instantly without digging through cron logs.",
  },
]

const comparisons = [
  {
    method: "Manual Excel exports",
    pain: "Someone has to remember to run it. Every time.",
    withQ2M: "Runs automatically on schedule. Zero human intervention.",
  },
  {
    method: "Python cron job",
    pain: "Breaks when pandas upgrades. Needs maintenance forever.",
    withQ2M: "Managed infrastructure. No scripts to babysit.",
  },
  {
    method: "PowerBI / Tableau",
    pain: "Stakeholders need logins and training. Nobody uses it.",
    withQ2M: "Reports go to their inbox. No learning curve.",
  },
]

export default function FeaturesPage() {
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
            className="h-[500px] w-[500px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, oklch(0.795 0.184 86.047) 0%, transparent 70%)" }}
          />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-4 font-heading text-xs tracking-widest text-primary uppercase">
            Features
          </p>
          <h1 className="mb-6 font-heading text-4xl font-medium leading-tight tracking-tight text-foreground sm:text-5xl">
            Automated database reporting.
            <br />
            <span className="text-muted-foreground">No infrastructure to own.</span>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-muted-foreground">
            Query2Mail handles scheduling, Excel generation, and email delivery so your stakeholders
            always have fresh data in their inbox — without you lifting a finger after setup.
          </p>
          <Button size="lg" asChild>
            <Link href="/login">Start for free →</Link>
          </Button>
        </div>
      </section>

      {/* Feature grid */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-16 text-center">
          <h2 className="font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Everything the job needs.
            <br />
            <span className="text-muted-foreground">Nothing it doesn&apos;t.</span>
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="border-white/8 bg-card/50 backdrop-blur-sm transition-colors hover:border-white/15">
              <CardContent className="p-6">
                <f.icon className="mb-4 h-5 w-5 text-primary" />
                <h3 className="mb-2 font-heading text-sm font-medium text-foreground">{f.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <div className="mb-16 text-center">
          <p className="mb-4 font-heading text-xs tracking-widest text-primary uppercase">
            How it compares
          </p>
          <h2 className="font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            You&apos;ve tried the alternatives.
          </h2>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/8">
          <div className="grid grid-cols-3 border-b border-white/8 bg-card/30 px-6 py-3">
            <p className="font-heading text-xs text-muted-foreground">Method</p>
            <p className="font-heading text-xs text-muted-foreground">The problem</p>
            <p className="font-heading text-xs text-primary">With Query2Mail</p>
          </div>
          {comparisons.map((row, i) => (
            <div
              key={row.method}
              className={`grid grid-cols-3 gap-4 px-6 py-5 ${i < comparisons.length - 1 ? "border-b border-white/5" : ""}`}
            >
              <p className="font-heading text-xs font-medium text-foreground">{row.method}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">{row.pain}</p>
              <div className="flex items-start gap-2">
                <Check className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                <p className="text-xs leading-relaxed text-foreground">{row.withQ2M}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 px-6 py-24 text-center">
        <h2 className="mb-4 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
          Ready to stop doing it manually?
        </h2>
        <p className="mb-8 text-sm text-muted-foreground">
          Connect your database, write a query, set a schedule. Done.
        </p>
        <Button size="lg" asChild>
          <Link href="/login">Send your first report in 5 min →</Link>
        </Button>
        <p className="mt-4 text-xs text-muted-foreground/60">Free to start. No credit card required.</p>
      </section>
    </div>
  )
}
