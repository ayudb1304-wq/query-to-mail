import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

// Stub — real execution wired in Phase 5
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

  const { id } = await params

  const { data: job } = await supabase
    .from("query_jobs")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()
  if (!job) return NextResponse.json({ error: "Not found." }, { status: 404 })

  return NextResponse.json({ message: "Execution queued." }, { status: 202 })
}
