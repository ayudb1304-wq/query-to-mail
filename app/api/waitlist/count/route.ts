import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

// Hardcoded offset so the counter doesn't start from 0 on day one.
// Represents signups before this counter was wired to the DB.
const BASE_COUNT = 6
const TOTAL_SPOTS = 20

export async function GET() {
  const supabase = createServiceClient()

  const { count, error } = await supabase
    .from("waitlist")
    .select("*", { count: "exact", head: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const claimed = Math.min((count ?? 0) + BASE_COUNT, TOTAL_SPOTS)
  const remaining = TOTAL_SPOTS - claimed

  return NextResponse.json(
    { claimed, remaining, total: TOTAL_SPOTS },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
  )
}
