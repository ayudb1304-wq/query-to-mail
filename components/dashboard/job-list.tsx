"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { CalendarClock, Plus, Play, Trash2, Loader2, Pencil } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { cronToDescription } from "@/lib/cron-utils"

interface Job {
  id: string
  name: string
  sql_query: string
  cron_expression: string
  timezone: string
  recipients: string[]
  is_active: boolean
  last_run_at: string | null
  next_run_at: string | null
  connection: { id: string; name: string; db_type: string } | null
}

function formatDate(iso: string | null) {
  if (!iso) return "Never"
  return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
}

export function JobList() {
  const [jobs, setJobs]       = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState<string | null>(null)

  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch("/api/queries")
      if (!res.ok) return
      setJobs(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchJobs() }, [fetchJobs])

  async function toggleActive(job: Job) {
    const next = !job.is_active
    setJobs((prev) => prev.map((j) => j.id === job.id ? { ...j, is_active: next } : j))
    const res = await fetch(`/api/queries/${job.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: next }),
    })
    if (!res.ok) {
      setJobs((prev) => prev.map((j) => j.id === job.id ? { ...j, is_active: job.is_active } : j))
      toast.error("Failed to update job.")
    }
  }

  async function handleRun(id: string) {
    setRunning(id)
    try {
      const res = await fetch(`/api/queries/${id}/run`, { method: "POST" })
      if (res.ok) {
        toast.success("Job executed. Check Logs for the result.")
      } else {
        toast.error("Failed to run job.")
      }
    } finally {
      setRunning(null)
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    const res = await fetch(`/api/queries/${id}`, { method: "DELETE" })
    if (res.ok) {
      setJobs((prev) => prev.filter((j) => j.id !== id))
      toast.success("Job deleted.")
    } else {
      toast.error("Failed to delete job.")
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Header />
        <div className="flex items-center justify-center py-20 text-xs text-muted-foreground">Loading…</div>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <Header />
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-card/20 py-20 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <CalendarClock className="h-5 w-5 text-muted-foreground/40" />
          </div>
          <p className="font-heading text-sm font-medium text-foreground">No jobs yet</p>
          <p className="mt-2 max-w-xs text-xs text-muted-foreground">
            Create a scheduled query job. Write your SQL, pick a schedule, and add recipient emails.
          </p>
          <Button size="sm" className="mt-6" asChild>
            <Link href="/dashboard/jobs/new">
              <Plus className="mr-2 h-3.5 w-3.5" />
              Create job
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Header />
      <div className="flex flex-col gap-2">
        {jobs.map((job) => (
          <div key={job.id} className="rounded-xl border border-white/8 bg-card/50 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-xs font-medium text-foreground truncate">{job.name}</p>
                  <Badge variant="secondary" className={`shrink-0 text-[10px] border ${job.is_active ? "border-green-500/30 bg-green-500/10 text-green-400" : "border-white/10 bg-white/5 text-muted-foreground"}`}>
                    {job.is_active ? "Active" : "Paused"}
                  </Badge>
                  {job.connection && (
                    <Badge variant="secondary" className="shrink-0 border-white/10 bg-white/5 text-[10px] text-muted-foreground">
                      {job.connection.name}
                    </Badge>
                  )}
                </div>

                <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>🕐 {cronToDescription(job.cron_expression, job.timezone)}</span>
                  <span>📧 {job.recipients.length} recipient{job.recipients.length !== 1 ? "s" : ""}</span>
                  <span>Last run: {formatDate(job.last_run_at)}</span>
                </div>

                <pre className="mt-2 max-h-12 overflow-hidden rounded bg-white/5 px-2 py-1.5 text-[10px] leading-relaxed text-muted-foreground/70 font-mono">
                  {job.sql_query.slice(0, 120)}{job.sql_query.length > 120 ? "…" : ""}
                </pre>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Switch
                  checked={job.is_active}
                  onCheckedChange={() => toggleActive(job)}
                  aria-label="Toggle active"
                />
                <Button
                  variant="ghost" size="icon"
                  className="h-7 w-7 text-muted-foreground/40 hover:text-foreground"
                  onClick={() => handleRun(job.id)}
                  disabled={running === job.id}
                >
                  {running === job.id
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <Play className="h-3.5 w-3.5" />}
                  <span className="sr-only">Run</span>
                </Button>
                <Button
                  variant="ghost" size="icon"
                  className="h-7 w-7 text-muted-foreground/40 hover:text-foreground"
                  asChild
                >
                  <Link href={`/dashboard/jobs/${job.id}/edit`}>
                    <Pencil className="h-3.5 w-3.5" />
                    <span className="sr-only">Edit</span>
                  </Link>
                </Button>
                <Button
                  variant="ghost" size="icon"
                  className="h-7 w-7 text-muted-foreground/40 hover:text-destructive"
                  onClick={() => handleDelete(job.id, job.name)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Header() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="font-heading text-xl font-medium text-foreground">Jobs</h1>
        <p className="mt-1 text-xs text-muted-foreground">Scheduled SQL queries that deliver Excel reports.</p>
      </div>
      <Button size="sm" asChild>
        <Link href="/dashboard/jobs/new">
          <Plus className="mr-2 h-3.5 w-3.5" />
          Create job
        </Link>
      </Button>
    </div>
  )
}
