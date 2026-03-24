"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

function ScrollLink({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  const router = useRouter()

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault()
    const id = href.replace("#", "")
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    } else {
      router.push(href)
    }
  }

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-heading text-sm font-medium tracking-tight">
          Query<span className="text-primary">2</span>Mail
        </Link>
        <nav className="flex items-center gap-6">
          <ScrollLink
            href="#how-it-works"
            className="hidden cursor-pointer text-xs text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            How it works
          </ScrollLink>
          <ScrollLink
            href="#pricing"
            className="hidden cursor-pointer text-xs text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Pricing
          </ScrollLink>
          <Button size="sm" asChild>
            <Link href="/login">Start automating →</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
