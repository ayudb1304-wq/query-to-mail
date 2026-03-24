import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

export function FooterCta() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5">
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="h-[400px] w-[400px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, oklch(0.795 0.184 86.047) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="mb-4 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
          Stop being the accidental BI developer.
        </h2>
        <p className="mb-8 text-sm text-muted-foreground">
          Connect your database, write a query, set a schedule. Done.
        </p>
        <Button size="lg" asChild>
          <Link href="/login">Start automating for free</Link>
        </Button>
      </div>

      <Separator className="opacity-5" />

      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 sm:flex-row">
        <p className="font-heading text-xs text-muted-foreground/40">
          Query<span className="text-primary/60">2</span>Mail
        </p>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  )
}
