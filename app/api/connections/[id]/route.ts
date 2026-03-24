import { NextResponse } from "next/server"
import { createServerSupabaseClient, createServiceClient } from "@/lib/supabase/server"

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  const { id } = await params

  // Verify ownership first
  const { data: existing } = await supabase
    .from("connections")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (!existing) {
    return NextResponse.json({ error: "Not found." }, { status: 404 })
  }

  const service = createServiceClient()
  const { error } = await service
    .from("connections")
    .delete()
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return new NextResponse(null, { status: 204 })
}
