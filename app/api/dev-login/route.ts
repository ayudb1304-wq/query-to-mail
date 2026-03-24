// ⚠️ DEV BYPASS — REMOVE BEFORE PUBLIC LAUNCH
// This route generates a magic link server-side and returns it directly,
// bypassing email delivery. Only works for the hardcoded dev email.
// See plan.md for the removal checklist item.

import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

const DEV_EMAIL = "ayucorp1304@gmail.com"

export async function POST(request: Request) {
  const { email, origin } = await request.json()

  if (email !== DEV_EMAIL) {
    return NextResponse.json({ error: "Not permitted." }, { status: 403 })
  }

  const supabase = createServiceClient()

  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email: DEV_EMAIL,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error || !data.properties?.action_link) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to generate link." },
      { status: 500 },
    )
  }

  return NextResponse.json({ url: data.properties.action_link })
}
