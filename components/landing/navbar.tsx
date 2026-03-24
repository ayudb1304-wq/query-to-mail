import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-heading text-sm font-medium tracking-tight">
          Query<span className="text-primary">2</span>Mail
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="#how-it-works"
            className="hidden text-xs text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            How it works
          </Link>
          <Link
            href="#pricing"
            className="hidden text-xs text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Pricing
          </Link>
          <Button size="sm" asChild>
            <Link href="#waitlist">Get early access</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
