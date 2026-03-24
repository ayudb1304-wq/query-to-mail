import { NextResponse } from "next/server"
import { z } from "zod"
import { createServerSupabaseClient, createServiceClient } from "@/lib/supabase/server"
import { computeNextRunAt } from "@/lib/cron-utils"

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  sql_query: z.string().min(1).optional(),
  cron_expression: z.string().min(1).optional(),
  recipients: z.array(z.string().email()).min(1).optional(),
  is_active: z.boolean().optional(),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

  const { id } = await params

  const { data: existing } = await supabase
    .from("query_jobs")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()
  if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 })

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 })
  }

  const update: Record<string, unknown> = { ...parsed.data }
  if (parsed.data.cron_expression) {
    update.next_run_at = computeNextRunAt(parsed.data.cron_expression).toISOString()
  }

  const service = createServiceClient()
  const { data, error } = await service
    .from("query_jobs")
    .update(update)
    .eq("id", id)
    .select("id, name, cron_expression, recipients, is_active, next_run_at")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

  const { id } = await params

  const { data: existing } = await supabase
    .from("query_jobs")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()
  if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 })

  const service = createServiceClient()
  const { error } = await service.from("query_jobs").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new NextResponse(null, { status: 204 })
}
