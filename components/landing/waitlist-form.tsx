"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function WaitlistForm({ size = "default" }: { size?: "default" | "lg" }) {
  const [email, setEmail] = useState("")
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState("loading")
    setErrorMsg("")

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong.")
        setState("error")
        return
      }

      setState("success")
      setEmail("")
    } catch {
      setErrorMsg("Something went wrong. Please try again.")
      setState("error")
    }
  }

  if (state === "success") {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3">
        <span className="text-primary">✓</span>
        <p className="text-sm text-foreground">
          You&apos;re on the list. We&apos;ll reach out when we&apos;re ready.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2 sm:flex-row">
      <Input
        type="email"
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={state === "loading"}
        className={
          size === "lg"
            ? "h-11 bg-white/5 text-sm placeholder:text-muted-foreground/60 sm:flex-1"
            : "bg-white/5 text-sm placeholder:text-muted-foreground/60 sm:flex-1"
        }
      />
      <Button
        type="submit"
        disabled={state === "loading"}
        size={size === "lg" ? "lg" : "default"}
        className="shrink-0"
      >
        {state === "loading" ? "Joining…" : "Get early access"}
      </Button>
      {state === "error" && (
        <p className="w-full text-xs text-destructive">{errorMsg}</p>
      )}
    </form>
  )
}
