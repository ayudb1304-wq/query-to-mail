import { NextResponse } from "next/server"
import { z } from "zod"
import { createServerSupabaseClient, createServiceClient } from "@/lib/supabase/server"
import { encrypt } from "@/lib/crypto"

const createSchema = z.object({
  name: z.string().min(1, "Name is required."),
  db_type: z.enum(["postgres", "mysql"]),
  host: z.string().min(1, "Host is required."),
  port: z.number().int().min(1).max(65535),
  database_name: z.string().min(1, "Database name is required."),
  username: z.string().min(1, "Username is required."),
  password: z.string().min(1, "Password is required."),
})

export async function GET() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("connections")
    .select("id, name, db_type, host, port, database_name, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    )
  }

  const { username, password, ...rest } = parsed.data

  const service = createServiceClient()
  const { data, error } = await service
    .from("connections")
    .insert({
      ...rest,
      user_id: user.id,
      username_enc: encrypt(username),
      password_enc: encrypt(password),
    })
    .select("id, name, db_type, host, port, database_name, created_at")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
