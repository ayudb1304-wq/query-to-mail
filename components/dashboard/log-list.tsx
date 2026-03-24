"use client"

import { useEffect, useState, useCallback } from "react"
import { ScrollText, Download, ChevronDown, ChevronUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface LogEntry {
  id: string
  status: "running" | "success" | "failed"
  rows_returned: number | null
  file_size_bytes: number | null
  delivery_method: "attachment" | "link" | null
  download_url: string | null
  error_message: string | null
  executed_at: string
  job: { id: string; name: string } | null
}

interface JobOption {
  id: string
  name: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
}

function formatBytes(bytes: number | null) {
  if (bytes == null) return "—"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const STATUS_STYLES: Record<LogEntry["status"], string> = {
  success: "border-green-500/30 bg-green-500/10 text-green-400",
  failed:  "border-red-500/30  bg-red-500/10  text-red-400",
  running: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
}

function LogRow({ log }: { log: LogEntry }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-xl border border-white/8 bg-card/50 px-4 py-3">
      <div className="flex items-center gap-3 flex-wrap">
        <Badge
          variant="secondary"
          className={`shrink-0 border text-[10px] capitalize ${STATUS_STYLES[log.status]}`}
        >
          {log.status}
        </Badge>

        <span className="text-xs font-medium text-foreground truncate">
          {log.job?.name ?? "Deleted job"}
        </span>

        <span className="ml-auto shrink-0 text-xs text-muted-foreground">
          {formatDate(log.executed_at)}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>{log.rows_returned != null ? `${log.rows_returned.toLocaleString()} rows` : "—"}</span>
        <span>{formatBytes(log.file_size_bytes)}</span>
        {log.delivery_method && (
          <span className="capitalize">{log.delivery_method}</span>
        )}
        {log.download_url && (
          <a
            href={log.download_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <Download className="h-3 w-3" />
            Download
          </a>
        )}
      </div>

      {log.error_message && (
        <div className="mt-2">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-1 text-[10px] text-red-400/70 hover:text-red-400"
          >
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {expanded ? "Hide error" : "Show error"}
          </button>
          {expanded && (
            <pre className="mt-1.5 overflow-x-auto rounded bg-red-500/5 px-3 py-2 text-[10px] leading-relaxed text-red-400/80 font-mono border border-red-500/10">
              {log.error_message}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}

export function LogList() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [jobs, setJobs] = useState<JobOption[]>([])
  const [loading, setLoading] = useState(true)

  const [jobId,  setJobId]  = useState("all")
  const [status, setStatus] = useState("all")
  const [from,   setFrom]   = useState("")
  const [to,     setTo]     = useState("")

  // Fetch job list once for the filter dropdown
  useEffect(() => {
    fetch("/api/queries")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setJobs(data.map((j: { id: string; name: string }) => ({ id: j.id, name: j.name }))) })
      .catch(() => {})
  }, [])

  const fetchLogs = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (jobId  !== "all") params.set("job_id", jobId)
    if (status !== "all") params.set("status", status)
    if (from) params.set("from", new Date(from).toISOString())
    if (to)   params.set("to",   new Date(to + "T23:59:59").toISOString())

    fetch(`/api/logs?${params}`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setLogs(data) })
      .finally(() => setLoading(false))
  }, [jobId, status, from, to])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Select value={jobId} onValueChange={setJobId}>
          <SelectTrigger className="h-8 w-44 text-xs">
            <SelectValue placeholder="All jobs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All jobs</SelectItem>
            {jobs.map((j) => (
              <SelectItem key={j.id} value={j.id}>{j.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-8 w-36 text-xs">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="running">Running</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="h-8 w-36 text-xs"
          placeholder="From"
        />
        <Input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="h-8 w-36 text-xs"
          placeholder="To"
        />
      </div>

      {/* Log rows */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-xs text-muted-foreground">
          Loading…
        </div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-card/20 py-20 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <ScrollText className="h-5 w-5 text-muted-foreground/40" />
          </div>
          <p className="font-heading text-sm font-medium text-foreground">No runs yet</p>
          <p className="mt-2 max-w-xs text-xs text-muted-foreground">
            Logs appear here once a job executes. Each entry shows status, row count, file size, and delivery method.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {logs.map((log) => (
            <LogRow key={log.id} log={log} />
          ))}
        </div>
      )}
    </div>
  )
}
