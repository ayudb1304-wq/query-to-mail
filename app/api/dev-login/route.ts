// ⚠️ DEV BYPASS — REMOVE BEFORE PUBLIC LAUNCH
// Generates an OTP server-side and returns it to the client for direct
// verification, bypassing email delivery and redirect URL allowlists.
// See plan.md for the removal checklist item.

import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

const DEV_EMAIL = "ayucorp1304@gmail.com"

export async function POST(request: Request) {
  const { email } = await request.json()

  if (email !== DEV_EMAIL) {
    return NextResponse.json({ error: "Not permitted." }, { status: 403 })
  }

  const supabase = createServiceClient()

  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email: DEV_EMAIL,
  })

  if (error || !data.properties?.email_otp) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to generate OTP." },
      { status: 500 },
    )
  }

  return NextResponse.json({ otp: data.properties.email_otp })
}
