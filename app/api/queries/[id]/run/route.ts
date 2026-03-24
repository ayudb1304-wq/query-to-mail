import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { executeJob } from "@/lib/executor"

export const maxDuration = 60

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

  const { id } = await params

  // Verify ownership before executing
  const { data: job } = await supabase
    .from("query_jobs")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()
  if (!job) return NextResponse.json({ error: "Not found." }, { status: 404 })

  try {
    await executeJob(id)
    return NextResponse.json({ message: "Job executed successfully." })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
