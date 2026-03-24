"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { Database, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AddConnectionDialog } from "./add-connection-dialog"
import { TestConnectionBtn } from "./test-connection-btn"

interface Connection {
  id: string
  name: string
  db_type: "postgres" | "mysql"
  host: string
  port: number
  database_name: string
  created_at: string
}

export function ConnectionList() {
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)

  const fetchConnections = useCallback(async () => {
    try {
      const res = await fetch("/api/connections")
      if (!res.ok) return
      const data = await res.json()
      setConnections(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConnections()
  }, [fetchConnections])

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return

    const res = await fetch(`/api/connections/${id}`, { method: "DELETE" })
    if (res.ok) {
      setConnections((prev) => prev.filter((c) => c.id !== id))
      toast.success("Connection deleted.")
    } else {
      toast.error("Failed to delete connection.")
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Header onCreated={fetchConnections} />
        <div className="flex items-center justify-center py-20 text-xs text-muted-foreground">
          Loading…
        </div>
      </div>
    )
  }

  if (connections.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <Header onCreated={fetchConnections} />
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-card/20 py-20 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <Database className="h-5 w-5 text-muted-foreground/40" />
          </div>
          <p className="font-heading text-sm font-medium text-foreground">No connections yet</p>
          <p className="mt-2 max-w-xs text-xs text-muted-foreground">
            Add your first PostgreSQL or MySQL database. Credentials are encrypted with AES-256.
          </p>
          <div className="mt-6">
            <AddConnectionDialog onCreated={fetchConnections} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Header onCreated={fetchConnections} />
      <div className="flex flex-col gap-2">
        {connections.map((conn) => (
          <div
            key={conn.id}
            className="flex items-center gap-4 rounded-xl border border-white/8 bg-card/50 px-4 py-3"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5">
              <Database className="h-3.5 w-3.5 text-muted-foreground/60" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-xs font-medium text-foreground">{conn.name}</p>
                <Badge variant="secondary" className="shrink-0 border-white/10 bg-white/5 text-[10px]">
                  {conn.db_type === "postgres" ? "PostgreSQL" : "MySQL"}
                </Badge>
              </div>
              <p className="truncate text-xs text-muted-foreground">
                {conn.host}:{conn.port} / {conn.database_name}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <TestConnectionBtn connectionId={conn.id} />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground/40 hover:text-destructive"
                onClick={() => handleDelete(conn.id, conn.name)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Header({ onCreated }: { onCreated: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="font-heading text-xl font-medium text-foreground">Connections</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Manage your read-only database connections.
        </p>
      </div>
      <AddConnectionDialog onCreated={onCreated} />
    </div>
  )
}
