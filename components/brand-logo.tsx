"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

/** Natural asset ratio: 1476×1046 */
const LOGO_ASPECT = 1476 / 1046

type BrandLogoProps = {
  className?: string
  priority?: boolean
  /** Tailwind height class for the image (width follows aspect ratio) */
  imgClassName?: string
  /** e.g. close mobile menu after navigation */
  onNavigate?: () => void
}

export function BrandLogo({ className, priority, imgClassName, onNavigate }: BrandLogoProps) {
  const h = 20
  const w = Math.round(h * LOGO_ASPECT)
  return (
    <Link
      href="/"
      className={cn("inline-flex shrink-0 items-center gap-2", className)}
      aria-label="Query2Mail home"
      onClick={onNavigate}
    >
      <Image
        src="/logo-querytomail.png"
        alt=""
        width={w}
        height={h}
        className={cn("h-5 w-auto rounded-md", imgClassName)}
        priority={priority}
        sizes="80px"
      />
      <span className="font-heading text-sm font-medium tracking-tight text-foreground">
        Query<span className="text-primary">2</span>Mail
      </span>
    </Link>
  )
}
