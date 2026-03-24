import { NextResponse } from "next/server"
import { z } from "zod"
import { createServerSupabaseClient, createServiceClient } from "@/lib/supabase/server"
import { computeNextRunAt } from "@/lib/cron-utils"

const createSchema = z.object({
  name: z.string().min(1, "Name is required."),
  connection_id: z.string().uuid("Invalid connection."),
  sql_query: z.string().min(1, "SQL query is required."),
  cron_expression: z.string().min(1, "Schedule is required."),
  timezone: z.string().min(1).default("UTC"),
  recipients: z.array(z.string().email()).min(1, "At least one recipient is required."),
})

export async function GET() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

  const { data, error } = await supabase
    .from("query_jobs")
    .select("id, name, sql_query, cron_expression, timezone, recipients, is_active, last_run_at, next_run_at, created_at, connection:connections(id, name, db_type)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 })
  }

  // Verify connection belongs to user
  const { data: conn } = await supabase
    .from("connections")
    .select("id")
    .eq("id", parsed.data.connection_id)
    .eq("user_id", user.id)
    .single()

  if (!conn) return NextResponse.json({ error: "Connection not found." }, { status: 404 })

  const next_run_at = computeNextRunAt(parsed.data.cron_expression, parsed.data.timezone)

  const service = createServiceClient()
  const { data, error } = await service
    .from("query_jobs")
    .insert({ ...parsed.data, user_id: user.id, next_run_at: next_run_at.toISOString() })
    .select("id, name, cron_expression, recipients, is_active, next_run_at, created_at")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
