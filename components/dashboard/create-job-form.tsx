"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { buildCronExpression, parseCronExpression, cronToDescription, DAY_NAMES, type Frequency } from "@/lib/cron-utils"

interface Connection { id: string; name: string; db_type: string }

interface InitialJob {
  id: string
  name: string
  connection_id: string
  sql_query: string
  cron_expression: string
  recipients: string[]
}

const HOURS   = Array.from({ length: 24 }, (_, i) => i)
const MINUTES = [0, 15, 30, 45]
const DOM     = Array.from({ length: 28 }, (_, i) => i + 1)

function pad(n: number) { return n.toString().padStart(2, "0") }

export function CreateJobForm({ initialJob }: { initialJob?: InitialJob }) {
  const router = useRouter()
  const isEditing = !!initialJob
  const [loading, setLoading] = useState(false)
  const [connections, setConnections] = useState<Connection[]>([])

  const parsed = initialJob ? parseCronExpression(initialJob.cron_expression) : null

  // Form state
  const [name, setName]               = useState(initialJob?.name ?? "")
  const [connectionId, setConnectionId] = useState(initialJob?.connection_id ?? "")
  const [sql, setSql]                 = useState(initialJob?.sql_query ?? "")
  const [frequency, setFrequency]     = useState<Frequency>(parsed?.frequency ?? "daily")
  const [hour, setHour]               = useState(parsed?.hour ?? 8)
  const [minute, setMinute]           = useState(parsed?.minute ?? 0)
  const [dayOfWeek, setDayOfWeek]     = useState(parsed?.dayOfWeek ?? 1)
  const [dayOfMonth, setDayOfMonth]   = useState(parsed?.dayOfMonth ?? 1)
  const [recipientInput, setRecipientInput] = useState("")
  const [recipients, setRecipients]   = useState<string[]>(initialJob?.recipients ?? [])

  useEffect(() => {
    fetch("/api/connections")
      .then((r) => r.json())
      .then((data) => {
        setConnections(data)
        if (!initialJob && data.length > 0) setConnectionId(data[0].id)
      })
      .catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cron = buildCronExpression(frequency, hour, minute, dayOfWeek, dayOfMonth)
  const schedulePreview = cronToDescription(cron)

  function addRecipient(raw: string) {
    const emails = raw.split(/[,;\s]+/).map((e) => e.trim()).filter(Boolean)
    const valid = emails.filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
    if (valid.length === 0) return
    setRecipients((prev) => [...new Set([...prev, ...valid])])
    setRecipientInput("")
  }

  function handleRecipientKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addRecipient(recipientInput)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (recipients.length === 0) {
      toast.error("Add at least one recipient email.")
      return
    }
    setLoading(true)
    try {
      const url    = isEditing ? `/api/queries/${initialJob!.id}` : "/api/queries"
      const method = isEditing ? "PATCH" : "POST"
      const body   = isEditing
        ? { name, sql_query: sql, cron_expression: cron, recipients }
        : { name, connection_id: connectionId, sql_query: sql, cron_expression: cron, recipients }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error ?? `Failed to ${isEditing ? "update" : "create"} job.`); return }
      toast.success(isEditing ? "Job updated." : "Job created.")
      router.push("/dashboard/jobs")
    } catch {
      toast.error("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* Name + Connection */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name" className="text-xs text-muted-foreground">Job name</Label>
          <Input id="name" placeholder="Weekly Revenue Report" value={name}
            onChange={(e) => setName(e.target.value)} required className="bg-white/5" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Database connection</Label>
          {connections.length === 0 ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              No connections found. <a href="/dashboard/connections" className="underline">Add one first.</a>
            </p>
          ) : (
            <Select value={connectionId} onValueChange={setConnectionId}>
              <SelectTrigger className="bg-white/5"><SelectValue /></SelectTrigger>
              <SelectContent className="border-white/10 bg-card">
                {connections.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* SQL Editor */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="sql" className="text-xs text-muted-foreground">SQL query</Label>
        <Textarea
          id="sql"
          placeholder={"SELECT region, SUM(total_amount) AS revenue\nFROM demo.sales\nGROUP BY region\nORDER BY revenue DESC;"}
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          required
          rows={8}
          className="resize-y bg-white/5 font-mono text-xs leading-relaxed"
        />
        <p className="text-xs text-muted-foreground/60">Write a read-only SELECT query. INSERT, UPDATE, DELETE are blocked.</p>
      </div>

      {/* Schedule */}
      <div className="flex flex-col gap-3 rounded-xl border border-white/8 bg-card/30 p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-foreground">Schedule</p>
          <span className="rounded border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs text-primary">
            {schedulePreview}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-4">
          {/* Frequency */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Frequency</Label>
            <Select value={frequency} onValueChange={(v) => setFrequency(v as Frequency)}>
              <SelectTrigger className="bg-white/5"><SelectValue /></SelectTrigger>
              <SelectContent className="border-white/10 bg-card">
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Day of week (weekly only) */}
          {frequency === "weekly" && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Day</Label>
              <Select value={dayOfWeek.toString()} onValueChange={(v) => setDayOfWeek(parseInt(v))}>
                <SelectTrigger className="bg-white/5"><SelectValue /></SelectTrigger>
                <SelectContent className="border-white/10 bg-card">
                  {DAY_NAMES.map((d, i) => (
                    <SelectItem key={i} value={i.toString()}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Day of month (monthly only) */}
          {frequency === "monthly" && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Day of month</Label>
              <Select value={dayOfMonth.toString()} onValueChange={(v) => setDayOfMonth(parseInt(v))}>
                <SelectTrigger className="bg-white/5"><SelectValue /></SelectTrigger>
                <SelectContent className="border-white/10 bg-card">
                  {DOM.map((d) => <SelectItem key={d} value={d.toString()}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Hour */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Hour (UTC)</Label>
            <Select value={hour.toString()} onValueChange={(v) => setHour(parseInt(v))}>
              <SelectTrigger className="bg-white/5"><SelectValue /></SelectTrigger>
              <SelectContent className="border-white/10 bg-card max-h-48">
                {HOURS.map((h) => <SelectItem key={h} value={h.toString()}>{pad(h)}:00</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Minute */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Minute</Label>
            <Select value={minute.toString()} onValueChange={(v) => setMinute(parseInt(v))}>
              <SelectTrigger className="bg-white/5"><SelectValue /></SelectTrigger>
              <SelectContent className="border-white/10 bg-card">
                {MINUTES.map((m) => <SelectItem key={m} value={m.toString()}>{pad(m)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Recipients */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Recipients</Label>
        <div className="flex min-h-10 flex-wrap gap-1.5 rounded-md border border-input bg-white/5 px-3 py-2 focus-within:ring-1 focus-within:ring-ring">
          {recipients.map((email) => (
            <span key={email} className="flex items-center gap-1 rounded border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-foreground">
              {email}
              <button type="button" onClick={() => setRecipients((p) => p.filter((e) => e !== email))}>
                <X className="h-2.5 w-2.5 text-muted-foreground hover:text-foreground" />
              </button>
            </span>
          ))}
          <input
            type="email"
            placeholder={recipients.length === 0 ? "cfo@company.com, ops@company.com" : "Add another…"}
            value={recipientInput}
            onChange={(e) => setRecipientInput(e.target.value)}
            onKeyDown={handleRecipientKeyDown}
            onBlur={() => recipientInput && addRecipient(recipientInput)}
            className="min-w-40 flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground/50"
          />
        </div>
        <p className="text-xs text-muted-foreground/60">Press Enter or comma to add. The Excel report will be emailed to all recipients.</p>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" size="sm" onClick={() => router.push("/dashboard/jobs")} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={loading || connections.length === 0}>
          {loading ? "Saving…" : isEditing ? "Save changes" : "Create job"}
        </Button>
      </div>
    </form>
  )
}
