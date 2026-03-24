import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { decrypt } from "@/lib/crypto"
import { testConnection } from "@/lib/db-connector"

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  const { id } = await params

  const { data: conn } = await supabase
    .from("connections")
    .select("db_type, host, port, database_name, username_enc, password_enc")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (!conn) {
    return NextResponse.json({ error: "Not found." }, { status: 404 })
  }

  try {
    await testConnection({
      db_type: conn.db_type,
      host: conn.host,
      port: conn.port,
      database_name: conn.database_name,
      username: decrypt(conn.username_enc),
      password: decrypt(conn.password_enc),
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Connection failed."
    return NextResponse.json({ ok: false, error: message }, { status: 200 })
  }
}
