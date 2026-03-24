import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"

export const metadata = {
  title: "Sign in — Query2Mail",
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center px-6">
      {/* Grid bg */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="font-heading text-sm font-medium tracking-tight">
            Query<span className="text-primary">2</span>Mail
          </Link>
          <p className="mt-3 text-lg font-medium tracking-tight text-foreground">
            Sign in to your account
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Enter your email and we&apos;ll send you a magic link.
          </p>
        </div>

        <div className="rounded-xl border border-white/8 bg-card/50 p-6 backdrop-blur-sm">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground/60">
          Don&apos;t have an account?{" "}
          <Link href="/#waitlist" className="text-muted-foreground underline underline-offset-4 hover:text-foreground">
            Join the waitlist
          </Link>
        </p>
      </div>
    </div>
  )
}
