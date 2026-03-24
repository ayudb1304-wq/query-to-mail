import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CreateJobForm } from "@/components/dashboard/create-job-form"

export const metadata = { title: "Create Job — Query2Mail" }

export default function NewJobPage() {
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
        <h1 className="mt-3 font-heading text-xl font-medium text-foreground">Create job</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Write a SQL query, set a schedule, and add recipient emails.
        </p>
      </div>
      <CreateJobForm />
    </div>
  )
}
