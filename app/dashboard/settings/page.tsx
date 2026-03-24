import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { User, Key, ShieldCheck } from "lucide-react"

export default async function SettingsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, { dateStyle: "long" })
    : "—"

  const lastSignIn = user?.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
    : "—"

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="font-heading text-xl font-medium text-foreground">Settings</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Manage your account and preferences.
        </p>
      </div>

      {/* Account Info */}
      <Card className="border-white/8 bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-xs text-foreground">{user?.email}</p>
          </div>
          <Separator className="bg-white/5" />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Member since</p>
            <p className="text-xs text-foreground">{memberSince}</p>
          </div>
          <Separator className="bg-white/5" />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Last sign in</p>
            <p className="text-xs text-foreground">{lastSignIn}</p>
          </div>
          <Separator className="bg-white/5" />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Auth method</p>
            <Badge variant="secondary" className="border border-white/10 bg-white/5 text-[10px] text-muted-foreground">
              Magic link
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* API Keys — placeholder for future */}
      <Card className="border-white/8 bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Key className="h-3.5 w-3.5 text-muted-foreground" />
            API Keys
            <Badge variant="secondary" className="ml-1 border border-white/10 bg-white/5 text-[10px] text-muted-foreground">
              Coming soon
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Programmatic access via API keys will be available in a future release. You&apos;ll be able to
            trigger jobs and fetch results from your own scripts.
          </p>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border-white/8 bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-foreground">Credential encryption</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">All database passwords are encrypted at rest with AES-256-GCM.</p>
            </div>
            <Badge variant="secondary" className="shrink-0 border border-green-500/30 bg-green-500/10 text-[10px] text-green-400">
              Active
            </Badge>
          </div>
          <Separator className="bg-white/5" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-foreground">Row-level security</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Your data is isolated — no other user can access your connections or jobs.</p>
            </div>
            <Badge variant="secondary" className="shrink-0 border border-green-500/30 bg-green-500/10 text-[10px] text-green-400">
              Active
            </Badge>
          </div>
          <Separator className="bg-white/5" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-foreground">Read-only query enforcement</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">All scheduled queries run inside a read-only transaction — writes are impossible.</p>
            </div>
            <Badge variant="secondary" className="shrink-0 border border-green-500/30 bg-green-500/10 text-[10px] text-green-400">
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
