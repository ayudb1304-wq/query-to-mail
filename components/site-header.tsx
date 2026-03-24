"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/brand-logo"

function HashSectionLink({
  hash,
  children,
  className,
}: {
  hash: string
  children: React.ReactNode
  className?: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const id = hash.replace(/^#/, "")

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault()
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
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <BrandLogo priority />
        <nav className="flex items-center gap-6">
          <HashSectionLink
            hash="#how-it-works"
            className="hidden cursor-pointer text-xs text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            How it works
          </HashSectionLink>
          <HashSectionLink
            hash="#pricing"
            className="hidden cursor-pointer text-xs text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Pricing
          </HashSectionLink>
          <Link
            href="/features"
            className="hidden text-xs text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Features
          </Link>
          <Link
            href="/blog"
            className="hidden text-xs text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Blog
          </Link>
          <Button size="sm" asChild>
            <Link href="/login">Start automating →</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
