"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import {
  LayoutDashboard,
  Database,
  CalendarClock,
  ScrollText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { SignOutButton } from "./sign-out-button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Connections", href: "/dashboard/connections", icon: Database, exact: false },
  { label: "Jobs", href: "/dashboard/jobs", icon: CalendarClock, exact: false },
  { label: "Logs", href: "/dashboard/logs", icon: ScrollText, exact: false },
]

function getInitials(email: string) {
  return email.slice(0, 2).toUpperCase()
}

export function Sidebar({ user }: { user: User }) {
  const pathname = usePathname()

  return (
    <aside className="hidden h-screen w-56 shrink-0 flex-col border-r border-white/5 bg-card/30 lg:flex">
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-white/5 px-5">
        <Link href="/" className="font-heading text-sm font-medium tracking-tight">
          Query<span className="text-primary">2</span>Mail
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {navItems.map(({ label, href, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Tooltip key={href}>
              <TooltipTrigger asChild>
                <Link
                  href={href}
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
              </TooltipTrigger>
              <TooltipContent side="right">{label}</TooltipContent>
            </Tooltip>
          )
        })}
      </nav>

      {/* User */}
      <div className="border-t border-white/5 p-3">
        <div className="flex items-center gap-3 rounded-md px-2 py-2">
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
    </aside>
  )
}
