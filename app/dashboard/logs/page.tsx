import { ScrollText } from "lucide-react"

export default function LogsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-xl font-medium text-foreground">
          Logs
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Execution history for all your scheduled jobs.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-card/20 py-20 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <ScrollText className="h-5 w-5 text-muted-foreground/40" />
        </div>
        <p className="font-heading text-sm font-medium text-foreground">
          No runs yet
        </p>
        <p className="mt-2 max-w-xs text-xs text-muted-foreground">
          Logs will appear here once a job executes. Each entry shows the run
          status, row count, file size, and delivery method.
        </p>
      </div>
    </div>
  )
}
