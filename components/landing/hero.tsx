import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 pt-14"
    >
      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      {/* Radial glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="h-[600px] w-[600px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, oklch(0.795 0.184 86.047) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
        <Badge variant="secondary" className="border border-white/10 bg-white/5 text-xs">
          Free to use — no credit card required
        </Badge>

        <h1 className="font-heading text-4xl font-medium leading-[1.15] tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Your stakeholders don&apos;t need a dashboard.
          <br />
          <span className="text-primary">
            They need the answer in their inbox.
          </span>
        </h1>

        <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
          Query2Mail runs your SQL on a schedule and delivers a perfectly
          formatted Excel file — automatically. No BI platform. No dashboards.
          No login required for recipients.
        </p>

        <div className="flex items-center gap-3">
          <Button size="lg" asChild>
            <Link href="/login">Get started free</Link>
          </Button>
          <Button size="lg" variant="ghost" asChild>
            <Link href="#how-it-works">See how it works</Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground/60">
          Sign in with your email. No password needed.
        </p>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
