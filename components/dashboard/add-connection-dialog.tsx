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
      <TooltipContent side="right" className="max-w-64 text-xs leading-relaxed">
        <p className="[&_b]:font-semibold [&_code]:font-mono">{children}</p>
      </TooltipContent>
    </Tooltip>
  )
}

const PLACEHOLDERS: Record<DbType, {
  host: string
  databaseName: string
  username: string
}> = {
  postgres: {
    host: "aws-0-us-east-1.pooler.supabase.com",
    databaseName: "postgres",
    username: "postgres.your-project-ref",
  },
  mysql: {
    host: "your-db-host.example.com",
    databaseName: "my_database",
    username: "root",
  },
}

const TOOLTIPS: Record<DbType, {
  host: React.ReactNode
  port: React.ReactNode
  databaseName: React.ReactNode
  username: React.ReactNode
  password: React.ReactNode
}> = {
  postgres: {
    host: <>The hostname of your PostgreSQL server. For Supabase, use the <b>Session mode pooler host</b> from Settings → Database → Connection pooling (e.g. <code>aws-0-[region].pooler.supabase.com</code>). The direct host is IPv6-only and may not connect.</>,
    port: <>Default PostgreSQL port is <code>5432</code>. For Supabase session pooler use <code>5432</code>; for transaction pooler (PgBouncer) use <code>6543</code>.</>,
    databaseName: <>The database to connect to. Usually <code>postgres</code> for most hosted providers including Supabase, Railway, and Neon.</>,
    username: <>Your database user. For Supabase with the pooler, the username includes the project ref: <code>postgres.[project-ref]</code>. Find it in Settings → Database → Connection pooling.</>,
    password: <>Your database password. For Supabase, go to Settings → Database → Database password. This is your DB password — not the anon key or service role key.</>,
  },
  mysql: {
    host: <>The hostname of your MySQL server. Found in your hosting provider's dashboard or connection string. For PlanetScale use the host from Settings → Passwords.</>,
    port: <>Default MySQL port is <code>3306</code>. Some cloud providers use custom ports — check your connection string.</>,
    databaseName: <>The name of the MySQL database (schema) to connect to. Found in your hosting provider's dashboard.</>,
    username: <>Your MySQL database user. For PlanetScale use the username from a generated password set.</>,
    password: <>Your MySQL database password. For PlanetScale, this is generated when you create a password set — it's only shown once.</>,
  },
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
                <FieldHelp>{TOOLTIPS[dbType].host}</FieldHelp>
              </div>
              <Input
                id="host"
                placeholder={PLACEHOLDERS[dbType].host}
                value={host}
                onChange={(e) => setHost(e.target.value)}
                required
                className="bg-white/5"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1">
                <Label htmlFor="port" className="text-xs text-muted-foreground">Port</Label>
                <FieldHelp>{TOOLTIPS[dbType].port}</FieldHelp>
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
              <FieldHelp>{TOOLTIPS[dbType].databaseName}</FieldHelp>
            </div>
            <Input
              id="database_name"
              placeholder={PLACEHOLDERS[dbType].databaseName}
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
                <FieldHelp>{TOOLTIPS[dbType].username}</FieldHelp>
              </div>
              <Input
                id="username"
                placeholder={PLACEHOLDERS[dbType].username}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-white/5"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1">
                <Label htmlFor="password" className="text-xs text-muted-foreground">Password</Label>
                <FieldHelp>{TOOLTIPS[dbType].password}</FieldHelp>
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
