"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/brand-logo"

function HashSectionLink({
  hash,
  children,
  className,
  onClick,
}: {
  hash: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  const pathname = usePathname()
  const router = useRouter()
  const id = hash.replace(/^#/, "")

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault()
    onClick?.()
    if (pathname === "/") {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: "smooth" })
        window.history.replaceState(null, "", hash)
      } else {
        router.push(`/#${id}`)
      }
    } else {
      router.push(`/#${id}`)
    }
  }

  return (
    <a href={`/#${id}`} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <BrandLogo priority />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 sm:flex">
          <HashSectionLink
            hash="#how-it-works"
            className="cursor-pointer text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            How it works
          </HashSectionLink>
          <HashSectionLink
            hash="#pricing"
            className="cursor-pointer text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Pricing
          </HashSectionLink>
          <Link href="/features" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
            Features
          </Link>
          <Link href="/blog" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
            Blog
          </Link>
          <Button size="sm" asChild>
            <Link href="/login">Start automating →</Link>
          </Button>
        </nav>

        {/* Mobile: CTA + hamburger */}
        <div className="flex items-center gap-2 sm:hidden">
          <Button size="sm" asChild>
            <Link href="/login">Start automating →</Link>
          </Button>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="border-t border-white/5 bg-background/95 px-6 py-4 sm:hidden">
          <nav className="flex flex-col gap-4">
            <HashSectionLink
              hash="#how-it-works"
              onClick={() => setMenuOpen(false)}
              className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              How it works
            </HashSectionLink>
            <HashSectionLink
              hash="#pricing"
              onClick={() => setMenuOpen(false)}
              className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </HashSectionLink>
            <Link
              href="/features"
              onClick={() => setMenuOpen(false)}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="/blog"
              onClick={() => setMenuOpen(false)}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Blog
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
