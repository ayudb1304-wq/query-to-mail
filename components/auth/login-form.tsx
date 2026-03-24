"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// ⚠️ DEV BYPASS — REMOVE BEFORE PUBLIC LAUNCH (see plan.md)
const DEV_BYPASS_EMAIL = "ayucorp1304@gmail.com"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [state, setState] = useState<"idle" | "loading" | "sent" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState("loading")
    setErrorMsg("")

    // ⚠️ DEV BYPASS — get OTP server-side, verify client-side, no redirect URL needed
    if (email === DEV_BYPASS_EMAIL) {
      try {
        const res = await fetch("/api/dev-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        })
        const data = await res.json()
        if (!res.ok) {
          setErrorMsg(data.error ?? "Dev login failed.")
          setState("error")
          return
        }
        const supabase = createClient()
        const { error } = await supabase.auth.verifyOtp({
          email: DEV_BYPASS_EMAIL,
          token: data.otp,
          type: "email",
        })
        if (error) {
          setErrorMsg(error.message)
          setState("error")
          return
        }
        router.push("/dashboard")
        return
      } catch {
        setErrorMsg("Dev login failed.")
        setState("error")
      }
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setErrorMsg(error.message)
      setState("error")
      return
    }

    setState("sent")
  }

  if (state === "sent") {
    return (
      <div className="flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/5 px-6 py-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-xl">
          ✉️
        </div>
        <p className="font-heading text-sm font-medium text-foreground">
          Check your inbox
        </p>
        <p className="text-xs text-muted-foreground">
          We sent a magic link to <span className="text-foreground">{email}</span>.
          Click it to sign in — no password needed.
        </p>
        <button
          onClick={() => setState("idle")}
          className="mt-2 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Use a different email
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-xs text-muted-foreground">
          Work email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={state === "loading"}
          className="bg-white/5 placeholder:text-muted-foreground/50"
        />
      </div>

      {state === "error" && (
        <p className="text-xs text-destructive">{errorMsg}</p>
      )}

      <Button type="submit" disabled={state === "loading"} className="w-full">
        {state === "loading" ? "Signing in…" : "Send magic link"}
      </Button>

      <p className="text-center text-xs text-muted-foreground/60">
        No password required. We&apos;ll email you a sign-in link.
      </p>
    </form>
  )
}
