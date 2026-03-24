import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"
import { executeJob } from "@/lib/executor"

export const maxDuration = 60 // Vercel Pro allows 300s; hobby is capped at 60s

export async function GET(request: Request) {
  // Verify cron secret (Vercel sends it automatically; GitHub Actions sends it via workflow)
  const auth = request.headers.get("authorization")
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  const supabase = createServiceClient()
  const now = new Date()

  // Find all due, active jobs
  const { data: jobs, error } = await supabase
    .from("query_jobs")
    .select("id")
    .eq("is_active", true)
    .lte("next_run_at", now.toISOString())

  if (error) {
    console.error("[cron] Failed to fetch jobs:", error.message)
    return NextResponse.json({ error: "Failed to fetch jobs." }, { status: 500 })
  }

  if (!jobs || jobs.length === 0) {
    return NextResponse.json({ ran: 0 })
  }

  // Claim window: bump next_run_at 10 min ahead before executing.
  // If executeJob() succeeds it will overwrite this with the real next occurrence.
  // If it fails, the 10-min bump prevents an immediate retry storm while still
  // allowing the job to be re-attempted on the next cycle.
  // This also acts as a distributed lock: if two invocations run simultaneously
  // (e.g. GitHub Actions + Vercel daily fallback), only the first UPDATE wins
  // per job (count > 0); the second sees count = 0 and skips.
  const claimUntil = new Date(now.getTime() + 10 * 60 * 1000).toISOString()

  const results: { id: string; ok: boolean; error?: string }[] = []

  for (const job of jobs) {
    // Atomic claim — only matches if next_run_at is still <= now
    const { count } = await supabase
      .from("query_jobs")
      .update({ next_run_at: claimUntil })
      .eq("id", job.id)
      .lte("next_run_at", now.toISOString())
      .select("id", { count: "exact", head: true })

    if (!count || count === 0) {
      console.log(`[cron] Job ${job.id} already claimed, skipping.`)
      continue
    }

    try {
      await executeJob(job.id)
      results.push({ id: job.id, ok: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error(`[cron] Job ${job.id} failed:`, message)
      results.push({ id: job.id, ok: false, error: message })
      // next_run_at stays at claimUntil — job retried ~10 min later
    }
  }

  return NextResponse.json({ ran: results.length, results })
}
