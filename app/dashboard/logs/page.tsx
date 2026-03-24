import { LogList } from "@/components/dashboard/log-list"

export default function LogsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-xl font-medium text-foreground">Logs</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Execution history for all your scheduled jobs.
        </p>
      </div>
      <LogList />
    </div>
  )
}
