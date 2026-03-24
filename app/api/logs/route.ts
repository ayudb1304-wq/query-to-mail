import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

  const { data, error } = await supabase
    .from("job_logs")
    .select("id, status, rows_returned, file_size_bytes, delivery_method, download_url, error_message, executed_at, job:query_jobs(id, name)")
    .eq("user_id", user.id)
    .order("executed_at", { ascending: false })
    .limit(200)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
