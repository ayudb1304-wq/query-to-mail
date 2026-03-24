import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const jobId  = searchParams.get("job_id")
  const status = searchParams.get("status")
  const from   = searchParams.get("from")
  const to     = searchParams.get("to")

  let query = supabase
    .from("job_logs")
    .select("id, status, rows_returned, file_size_bytes, delivery_method, download_url, error_message, executed_at, job:query_jobs(id, name)")
    .eq("user_id", user.id)
    .order("executed_at", { ascending: false })
    .limit(200)

  if (jobId)  query = query.eq("job_id", jobId)
  if (status && ["success", "failed", "running"].includes(status)) query = query.eq("status", status)
  if (from)   query = query.gte("executed_at", from)
  if (to)     query = query.lte("executed_at", to)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
