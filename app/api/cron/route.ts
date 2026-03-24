import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"
import { executeJob } from "@/lib/executor"

export const maxDuration = 60 // Vercel Pro allows 300s; hobby is capped at 60s

export async function GET(request: Request) {
  // Verify Vercel cron secret
  const auth = request.headers.get("authorization")
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  const supabase = createServiceClient()

  // Find all due, active jobs
  const { data: jobs, error } = await supabase
    .from("query_jobs")
    .select("id")
    .eq("is_active", true)
    .lte("next_run_at", new Date().toISOString())

  if (error) {
    console.error("[cron] Failed to fetch jobs:", error.message)
    return NextResponse.json({ error: "Failed to fetch jobs." }, { status: 500 })
  }

  if (!jobs || jobs.length === 0) {
    return NextResponse.json({ ran: 0 })
  }

  // Execute jobs sequentially (free plan: avoid hammering connections)
  const results: { id: string; ok: boolean; error?: string }[] = []
  for (const job of jobs) {
    try {
      await executeJob(job.id)
      results.push({ id: job.id, ok: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error(`[cron] Job ${job.id} failed:`, message)
      results.push({ id: job.id, ok: false, error: message })
    }
  }

  return NextResponse.json({ ran: results.length, results })
}
