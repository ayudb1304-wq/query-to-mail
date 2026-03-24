"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { Menu, LayoutDashboard, Database, CalendarClock, ScrollText, Settings } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { SignOutButton } from "./sign-out-button"
import { BrandLogo } from "@/components/brand-logo"

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Connections", href: "/dashboard/connections", icon: Database, exact: false },
  { label: "Jobs", href: "/dashboard/jobs", icon: CalendarClock, exact: false },
  { label: "Logs", href: "/dashboard/logs", icon: ScrollText, exact: false },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, exact: false },
]

const pageTitles: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/connections": "Connections",
  "/dashboard/jobs": "Jobs",
  "/dashboard/logs": "Logs",
  "/dashboard/settings": "Settings",
}

function getInitials(email: string) {
  return email.slice(0, 2).toUpperCase()
}

export function MobileNav({ user }: { user: User }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const pageTitle = pageTitles[pathname] ?? "Dashboard"

  return (
    <header className="flex h-14 items-center gap-4 border-b border-white/5 bg-card/30 px-4 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-56 border-r border-white/5 bg-card p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex h-14 items-center border-b border-white/5 px-5">
            <BrandLogo onNavigate={() => setOpen(false)} />
          </div>

          <nav className="flex flex-col gap-0.5 p-3">
            {navItems.map(({ label, href, icon: Icon, exact }) => {
              const isActive = exact ? pathname === href : pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-xs transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                  )}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  {label}
                </Link>
              )
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 border-t border-white/5 p-3">
            <div className="flex items-center gap-3 px-2 py-2">
              <Avatar className="h-6 w-6 shrink-0">
                <AvatarFallback className="bg-primary/20 text-primary text-[10px]">
                  {getInitials(user.email ?? "??")}
                </AvatarFallback>
              </Avatar>
              <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                {user.email}
              </p>
              <SignOutButton />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <span className="font-heading text-sm font-medium text-foreground">{pageTitle}</span>
    </header>
  )
}
