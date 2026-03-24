import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { CreateJobForm } from "@/components/dashboard/create-job-form"

export const metadata = { title: "Edit Job — Query2Mail" }

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: job } = await supabase
    .from("query_jobs")
    .select("id, name, connection_id, sql_query, cron_expression, recipients")
    .eq("id", id)
    .eq("user_id", user!.id)
    .single()

  if (!job) notFound()

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link
          href="/dashboard/jobs"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to jobs
        </Link>
        <h1 className="mt-3 font-heading text-xl font-medium text-foreground">Edit job</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Update the query, schedule, or recipients for <span className="text-foreground">{job.name}</span>.
        </p>
      </div>
      <CreateJobForm initialJob={job} />
    </div>
  )
}
