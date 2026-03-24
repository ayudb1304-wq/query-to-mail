"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { Zap, Check, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const TOTAL_SPOTS = 20

const perks = [
  "2 months free when paid tiers launch — applied automatically, no coupon needed",
  "Locked-in discounted pricing for life — you'll never pay the public rate",
  "Direct input on features and roadmap as a founding user",
  "Early access to every new integration before public release",
]

// Animates a number from `from` to `to` over ~800ms
function useAnimatedCount(to: number) {
  const [display, setDisplay] = useState(to)
  const prev = useRef(to)

  useEffect(() => {
    const from = prev.current
    prev.current = to
    if (from === to) return

    const steps = 20
    const diff = to - from
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplay(Math.round(from + (diff * i) / steps))
      if (i >= steps) clearInterval(id)
    }, 40)
    return () => clearInterval(id)
  }, [to])

  return display
}

export function EarlyAdopter() {
  const [claimed, setClaimed] = useState(6)         // initial render value
  const [remaining, setRemaining] = useState(14)
  const [fetchedOnce, setFetchedOnce] = useState(false)
  const [email, setEmail] = useState("")
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle")
  const sectionRef = useRef<HTMLElement>(null)

  const displayClaimed = useAnimatedCount(claimed)
  const pct = Math.round((claimed / TOTAL_SPOTS) * 100)

  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch("/api/waitlist/count")
      if (!res.ok) return
      const data = await res.json()
      setClaimed(data.claimed)
      setRemaining(data.remaining)
      setFetchedOnce(true)
    } catch {
      // silently fail — UI keeps showing last known value
    }
  }, [])

  // Fetch once when section scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) fetchCount() },
      { threshold: 0.2 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [fetchCount])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState("loading")
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? "Something went wrong.")
        setState(data.error?.includes("already") ? "success" : "error")
        return
      }
      setState("success")
      setEmail("")
      // Refresh counter — the user just moved it
      fetchCount()
    } catch {
      toast.error("Something went wrong. Please try again.")
      setState("error")
    }
  }

  return (
    <section ref={sectionRef} id="early-access" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
            <Zap className="h-3 w-3" />
            Early adopter offer
          </div>
          <h2 className="font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Be one of the first {TOTAL_SPOTS}.
            <br />
            <span className="text-muted-foreground">You&apos;ll thank yourself later.</span>
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            The first {TOTAL_SPOTS} users to join get exclusive perks that never expire —
            locked in before paid tiers even exist.
          </p>
        </div>

        {/* Live counter card */}
        <div className="mb-8 rounded-xl border border-white/8 bg-card/50 p-6">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium text-foreground">Early adopter spots claimed</p>
              {/* Live indicator dot */}
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="text-[10px] text-primary/70">live</span>
            </div>
            <div className="flex items-center gap-1.5">
              <p className="font-heading text-sm font-medium text-foreground">
                {displayClaimed} / {TOTAL_SPOTS}
              </p>
              {fetchedOnce && (
                <button
                  onClick={fetchCount}
                  className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                  title="Refresh count"
                >
                  <RefreshCw className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>

          {/* Humorous proof line */}
          <div className="mt-3 flex items-start justify-between gap-4">
            <p className="text-xs text-primary">
              <strong>{remaining} spot{remaining !== 1 ? "s" : ""} remaining.</strong>{" "}
              {remaining <= 5
                ? "Seriously, don't wait."
                : "Once they're gone, they're gone."}
            </p>
            <p className="shrink-0 text-right font-mono text-[10px] text-muted-foreground/40 leading-relaxed">
              {/* Dry SQL humour for the data engineer crowd */}
              SELECT COUNT(*)<br />
              FROM early_adopters<br />
              — updated in real-time
            </p>
          </div>

          <p className="mt-3 rounded-md border border-white/5 bg-white/[0.02] px-3 py-2 text-[11px] text-muted-foreground/60 italic">
            Yes, this counter is real. We know every SaaS claims urgency — ours is just a
            Supabase query. You&apos;re welcome to <span className="font-mono not-italic">SELECT *</span> and check for yourself.
          </p>
        </div>

        {/* Note: this is early-adopter specific */}
        <p className="mb-6 text-center text-xs text-muted-foreground/50">
          ↑ This counter tracks early adopter spot claims only — not total waitlist signups.
        </p>

        {/* Perks */}
        <ul className="mb-8 flex flex-col gap-3">
          {perks.map((perk) => (
            <li key={perk} className="flex items-start gap-3 text-sm text-muted-foreground">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10">
                <Check className="h-2.5 w-2.5 text-primary" />
              </span>
              {perk}
            </li>
          ))}
        </ul>

        {/* Waitlist form */}
        {state === "success" ? (
          <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 px-5 py-4">
            <Check className="h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">You&apos;re in the list.</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                We&apos;ll reach out when paid tiers launch. Your perks are locked in.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={state === "loading"}
              className="h-11 flex-1 bg-white/5 text-sm"
            />
            <Button type="submit" size="lg" disabled={state === "loading"} className="shrink-0">
              {state === "loading" ? "Claiming…" : "Claim my spot"}
            </Button>
          </form>
        )}

        <p className="mt-3 text-center text-xs text-muted-foreground/50">
          No credit card. No commitment. Just early access perks, forever.
        </p>
      </div>
    </section>
  )
}
