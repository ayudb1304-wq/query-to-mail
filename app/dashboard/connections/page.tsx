import { Database, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ConnectionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-medium text-foreground">
            Connections
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage your read-only database connections.
          </p>
        </div>
        <Button size="sm" disabled>
          <Plus className="mr-2 h-3.5 w-3.5" />
          Add connection
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-card/20 py-20 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <Database className="h-5 w-5 text-muted-foreground/40" />
        </div>
        <p className="font-heading text-sm font-medium text-foreground">
          No connections yet
        </p>
        <p className="mt-2 max-w-xs text-xs text-muted-foreground">
          Add your first PostgreSQL or MySQL database. Credentials are encrypted
          with AES-256 and never exposed.
        </p>
        <Button size="sm" className="mt-6" disabled>
          <Plus className="mr-2 h-3.5 w-3.5" />
          Add connection
        </Button>
      </div>
    </div>
  )
}
