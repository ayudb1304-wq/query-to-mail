"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

type Status = "idle" | "loading" | "ok" | "fail"

export function TestConnectionBtn({ connectionId }: { connectionId: string }) {
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  async function handleTest() {
    setStatus("loading")
    setErrorMsg("")

    try {
      const res = await fetch(`/api/connections/${connectionId}/test`, {
        method: "POST",
      })
      const data = await res.json()

      if (data.ok) {
        setStatus("ok")
      } else {
        setStatus("fail")
        setErrorMsg(data.error ?? "Connection failed.")
      }
    } catch {
      setStatus("fail")
      setErrorMsg("Request failed.")
    }
  }

  if (status === "ok") {
    return <Badge className="border-green-500/30 bg-green-500/10 text-green-400 text-xs">Connected</Badge>
  }

  if (status === "fail") {
    return (
      <div className="flex items-center gap-2">
        <Badge className="border-destructive/30 bg-destructive/10 text-destructive text-xs">Failed</Badge>
        {errorMsg && <span className="max-w-48 truncate text-xs text-muted-foreground" title={errorMsg}>{errorMsg}</span>}
        <button onClick={handleTest} className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground">
          Retry
        </button>
      </div>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 text-xs text-muted-foreground hover:text-foreground"
      onClick={handleTest}
      disabled={status === "loading"}
    >
      {status === "loading" ? (
        <><Loader2 className="mr-1.5 h-3 w-3 animate-spin" />Testing…</>
      ) : (
        "Test"
      )}
    </Button>
  )
}
