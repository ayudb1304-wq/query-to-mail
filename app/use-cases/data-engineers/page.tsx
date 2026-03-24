import type { Metadata } from "next"
import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PublicHeader } from "@/components/public-header"

export const metadata: Metadata = {
  title: "Query2Mail for Data Engineers — Automate Stakeholder Reporting",
  description:
    "Stop being the accidental BI developer. Query2Mail automates SQL-to-Excel reporting so you can focus on actual data engineering work.",
  alternates: { canonical: "/use-cases/data-engineers" },
  openGraph: {
    title: "Query2Mail for Data Engineers",
    description:
      "Automate stakeholder reporting with scheduled SQL queries and direct Excel delivery. No more manual exports, broken Python scripts, or unused dashboards.",
    url: "https://query2mail.com/use-cases/data-engineers",
  },
}

const timeSinks = [
  {
    title: "The BI platform nobody uses",
    body: "You built the dashboards. Your stakeholders opened them twice, then emailed you for an Excel export anyway. PowerBI and Tableau are great — when stakeholders actually use them.",
  },
  {
    title: "The Python cron job that owns you",
    body: "Works fine until pandas upgrades, the SMTP relay changes, or the prod database moves. You spend more time fixing the reporting pipeline than doing actual data work.",
  },
  {
    title: "The Friday Excel request",
    body: "It's 4:58 PM. You get: \"Can you send me last week's numbers?\" You run the query, export the CSV, clean it up in Excel, and hit send. Every. Single. Week.",
  },
]

const benefits = [
  "No more one-off export requests — reports run themselves",
  "No BI platform maintenance — there is no platform",
  "No broken cron jobs — managed infrastructure",
  "Recipients need no training, no login, no account",
  "Encrypted credentials — built for production environments",
  "Full execution logs — debug without digging through cron output",
]

const workflows = [
  {
    role: "Lead data engineer",
    workflow:
      "Set up weekly pipeline health summaries emailed to your manager. Daily anomaly reports sent to the on-call engineer. Monthly data quality scores delivered to stakeholders. None of it needs you after setup.",
  },
  {
    role: "Solo data engineer at a startup",
    workflow:
      "Replace the fragile Python script you inherited. Write the query once, schedule it, and stop fielding requests for the same data every Monday morning.",
  },
  {
    role: "DBA managing multiple teams",
    workflow:
      "Give each team the data they need on a schedule — without building a full BI layer or granting direct database access. You control the queries; they get Excel files.",
  },
]

export default function DataEngineersPage() {
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
            For data engineers
          </p>
          <h1 className="mb-6 font-heading text-4xl font-medium leading-tight tracking-tight text-foreground sm:text-5xl">
            You&apos;re a data engineer.
            <br />
            <span className="text-primary">Not a BI support team.</span>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-muted-foreground">
            Query2Mail automates the SQL-to-Excel reporting work that shouldn&apos;t fall on you.
            Schedule queries, deliver reports, and reclaim the time you were spending on manual exports.
          </p>
          <Button size="lg" asChild>
            <Link href="/login">Automate your first report free →</Link>
          </Button>
          <p className="mt-4 text-xs text-muted-foreground/60">
            No credit card. No dashboards. No login required for your stakeholders.
          </p>
        </div>
      </section>

      {/* Pain points */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-16 text-center">
          <p className="mb-4 font-heading text-xs tracking-widest text-primary uppercase">
            Sound familiar?
          </p>
          <h2 className="font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            The accidental BI developer tax.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {timeSinks.map((item) => (
            <Card key={item.title} className="border-white/8 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="mb-3 font-heading text-sm font-medium text-foreground">{item.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{item.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <div className="mb-12 text-center">
          <h2 className="font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            What changes when you use Query2Mail.
          </h2>
        </div>
        <ul className="space-y-3">
          {benefits.map((b) => (
            <li key={b} className="flex items-center gap-3 rounded-lg border border-white/8 bg-card/50 px-5 py-4">
              <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span className="text-sm text-muted-foreground">{b}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Workflows */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <div className="mb-12 text-center">
          <p className="mb-4 font-heading text-xs tracking-widest text-primary uppercase">
            Real workflows
          </p>
          <h2 className="font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            How it fits your day-to-day.
          </h2>
        </div>
        <div className="space-y-4">
          {workflows.map((w) => (
            <div key={w.role} className="rounded-xl border border-white/8 bg-card/50 p-6">
              <p className="mb-2 font-heading text-xs font-medium text-primary">{w.role}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{w.workflow}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 px-6 py-24 text-center">
        <h2 className="mb-4 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
          Stop being the accidental BI developer.
        </h2>
        <p className="mb-8 text-sm text-muted-foreground">
          Connect your database, write a query, set a schedule. Done.
        </p>
        <Button size="lg" asChild>
          <Link href="/login">Send your first automated report →</Link>
        </Button>
      </section>
    </div>
  )
}
