import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarClock, Mail, Activity } from "lucide-react"

const statCards = [
  {
    label: "Active Jobs",
    value: "0",
    icon: CalendarClock,
    description: "Scheduled queries running",
  },
  {
    label: "Emails Sent",
    value: "0",
    icon: Mail,
    description: "Last 30 days",
  },
  {
    label: "Last Run",
    value: "—",
    icon: Activity,
    description: "No jobs executed yet",
  },
]

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const firstName = user?.email?.split("@")[0] ?? "there"

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-xl font-medium text-foreground">
          Good morning, {firstName}.
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Here&apos;s an overview of your reporting pipeline.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {statCards.map(({ label, value, icon: Icon, description }) => (
          <Card key={label} className="border-white/8 bg-card/50">
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{label}</p>
                <Icon className="h-3.5 w-3.5 text-muted-foreground/40" />
              </div>
              <p className="font-heading text-3xl font-medium text-foreground">
                {value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground/60">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state prompt */}
      <div className="rounded-xl border border-dashed border-white/10 bg-card/20 p-10 text-center">
        <p className="font-heading text-sm font-medium text-foreground">
          Your pipeline is empty
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Start by adding a database connection, then create a scheduled query job.
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground/60">
          <span className="rounded border border-white/10 bg-white/5 px-2 py-1">
            1. Add connection
          </span>
          <span>→</span>
          <span className="rounded border border-white/10 bg-white/5 px-2 py-1">
            2. Write query
          </span>
          <span>→</span>
          <span className="rounded border border-white/10 bg-white/5 px-2 py-1">
            3. Set schedule
          </span>
        </div>
      </div>
    </div>
  )
}
