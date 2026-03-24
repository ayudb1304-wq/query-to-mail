import { Separator } from "@/components/ui/separator"
import { WaitlistForm } from "./waitlist-form"

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
          Join the waitlist. Be the first to automate your reporting pipeline.
        </p>
        <div className="mx-auto max-w-md">
          <WaitlistForm size="lg" />
        </div>
      </div>

      <Separator className="opacity-5" />

      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <p className="font-heading text-xs text-muted-foreground/40">
          Query<span className="text-primary/60">2</span>Mail
        </p>
        <p className="text-xs text-muted-foreground/40">
          Built for data engineers who are tired of being accidental BI developers.
        </p>
      </div>
    </footer>
  )
}
