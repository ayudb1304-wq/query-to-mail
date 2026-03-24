"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function SignOutButton() {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={handleSignOut}
          className="shrink-0 rounded p-1 text-muted-foreground/50 transition-colors hover:text-foreground"
          aria-label="Sign out"
        >
          <LogOut className="h-3 w-3" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">Sign out</TooltipContent>
    </Tooltip>
  )
}
