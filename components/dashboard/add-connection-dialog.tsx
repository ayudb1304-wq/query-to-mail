"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Plus, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type DbType = "postgres" | "mysql"

const DEFAULT_PORTS: Record<DbType, number> = {
  postgres: 5432,
  mysql: 3306,
}

interface Props {
  onCreated: () => void
}

function FieldHelp({ children }: { children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className="h-3 w-3 cursor-help text-muted-foreground/40 hover:text-muted-foreground/70" />
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-60 text-xs leading-relaxed">
        <p>{children}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export function AddConnectionDialog({ onCreated }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState("")
  const [dbType, setDbType] = useState<DbType>("postgres")
  const [host, setHost] = useState("")
  const [port, setPort] = useState<number>(5432)
  const [databaseName, setDatabaseName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  function handleDbTypeChange(value: DbType) {
    setDbType(value)
    setPort(DEFAULT_PORTS[value])
  }

  function reset() {
    setName("")
    setDbType("postgres")
    setHost("")
    setPort(5432)
    setDatabaseName("")
    setUsername("")
    setPassword("")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, db_type: dbType, host, port, database_name: databaseName, username, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error ?? "Failed to save connection.")
        return
      }

      toast.success("Connection saved.")
      setOpen(false)
      reset()
      onCreated()
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset() }}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-3.5 w-3.5" />
          Add connection
        </Button>
      </DialogTrigger>

      <DialogContent className="border-white/10 bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-sm font-medium">
            New database connection
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name" className="text-xs text-muted-foreground">Display name</Label>
            <Input
              id="name"
              placeholder="Production DB"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-white/5"
            />
          </div>

          {/* DB Type */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Database type</Label>
            <Select value={dbType} onValueChange={handleDbTypeChange}>
              <SelectTrigger className="bg-white/5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-card">
                <SelectItem value="postgres">PostgreSQL</SelectItem>
                <SelectItem value="mysql">MySQL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Host + Port */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 flex flex-col gap-1.5">
              <div className="flex items-center gap-1">
                <Label htmlFor="host" className="text-xs text-muted-foreground">Host</Label>
                <FieldHelp>
                  For Supabase, use the <span className="font-medium text-foreground">pooler host</span> (IPv4
                  compatible): go to{" "}
                  <span className="font-medium text-foreground">Settings → Database → Connection pooling → Session mode</span>.
                  Looks like{" "}
                  <span className="font-mono text-primary">aws-0-[region].pooler.supabase.com</span>.
                  The direct host (<span className="font-mono">db.[ref].supabase.co</span>) is IPv6-only and may not resolve.
                </FieldHelp>
              </div>
              <Input
                id="host"
                placeholder="db.xxxx.supabase.co"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                required
                className="bg-white/5"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1">
                <Label htmlFor="port" className="text-xs text-muted-foreground">Port</Label>
                <FieldHelp>
                  PostgreSQL default: <span className="font-mono text-primary">5432</span>. MySQL default:{" "}
                  <span className="font-mono text-primary">3306</span>. For Supabase, use{" "}
                  <span className="font-mono text-primary">5432</span> for a direct connection or{" "}
                  <span className="font-mono text-primary">6543</span> for the connection pooler (PgBouncer).
                </FieldHelp>
              </div>
              <Input
                id="port"
                type="number"
                value={port}
                onChange={(e) => setPort(Number(e.target.value))}
                required
                className="bg-white/5"
              />
            </div>
          </div>

          {/* Database name */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1">
              <Label htmlFor="database_name" className="text-xs text-muted-foreground">Database name</Label>
              <FieldHelp>
                The name of the database to connect to. For Supabase this is always{" "}
                <span className="font-mono text-primary">postgres</span>. For other hosted providers,
                check your dashboard or connection string.
              </FieldHelp>
            </div>
            <Input
              id="database_name"
              placeholder="postgres"
              value={databaseName}
              onChange={(e) => setDatabaseName(e.target.value)}
              required
              className="bg-white/5"
            />
          </div>

          {/* Username + Password */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1">
                <Label htmlFor="username" className="text-xs text-muted-foreground">Username</Label>
                <FieldHelp>
                  For Supabase with the connection pooler, the username includes your project ref:{" "}
                  <span className="font-mono text-primary">postgres.[project-ref]</span>. Find it in{" "}
                  <span className="font-medium text-foreground">Settings → Database → Connection pooling → Session mode</span>.
                </FieldHelp>
              </div>
              <Input
                id="username"
                placeholder="postgres"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-white/5"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1">
                <Label htmlFor="password" className="text-xs text-muted-foreground">Password</Label>
                <FieldHelp>
                  For Supabase: go to{" "}
                  <span className="font-medium text-foreground">Settings → Database → Database password</span>.
                  This is your DB password — not your anon key or service role key.
                </FieldHelp>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/5"
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground/60">
            Use a read-only user. Credentials are encrypted with AES-256 before storage.
          </p>

          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? "Saving…" : "Save connection"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
