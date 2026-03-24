"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Check } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const plans = [
  {
    name: "Starter",
    price: "$29",
    description: "For teams with straightforward reporting needs.",
    featured: false,
    features: [
      "5 database connections",
      "10 scheduled query jobs",
      "Daily & weekly scheduling",
      "Excel file delivery",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: "$79",
    description: "For teams running mission-critical data pipelines.",
    featured: true,
    features: [
      "Unlimited connections",
      "Unlimited query jobs",
      "Minute-level scheduling",
      "Large file fallback (download link)",
      "Priority support",
    ],
  },
]

function PlanCard({ plan }: { plan: typeof plans[number] }) {
  const [email, setEmail] = useState("")
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState("loading")
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? "Something went wrong.")
        setState("error")
        return
      }
      setState("success")
      setEmail("")
    } catch {
      toast.error("Something went wrong. Please try again.")
      setState("error")
    }
  }

  return (
    <Card
      className={
        plan.featured
          ? "relative border-primary/40 bg-card"
          : "border-white/8 bg-card/50"
      }
    >
      {plan.featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground text-xs">
            Most popular
          </Badge>
        </div>
      )}
      <CardHeader className="pb-4 pt-6">
        <p className="font-heading text-xs text-muted-foreground">{plan.name}</p>
        <div className="flex items-baseline gap-1">
          <span className="font-heading text-4xl font-medium text-foreground">
            {plan.price}
          </span>
          <span className="text-xs text-muted-foreground">/month</span>
        </div>
        <p className="text-xs text-muted-foreground">{plan.description}</p>
      </CardHeader>

      <Separator className="opacity-10" />

      <CardContent className="pb-6 pt-4">
        <ul className="mb-6 flex flex-col gap-2">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-xs text-muted-foreground">
              <Check className="h-3 w-3 shrink-0 text-primary" />
              {feature}
            </li>
          ))}
        </ul>

        {state === "success" ? (
          <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2.5">
            <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
            <p className="text-xs text-foreground">You&apos;re on the list!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <Input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={state === "loading"}
              className="bg-white/5 text-xs"
            />
            <Button
              type="submit"
              className="w-full"
              variant={plan.featured ? "default" : "outline"}
              disabled={state === "loading"}
            >
              {state === "loading" ? "Joining…" : `Join ${plan.name} waitlist`}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-16 text-center">
        <p className="mb-4 font-heading text-xs tracking-widest text-primary uppercase">
          Pricing
        </p>
        <h2 className="font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
          Simple, honest pricing.
          <br />
          <span className="text-muted-foreground">Cancel any time.</span>
        </h2>
        <p className="mt-4 text-sm text-muted-foreground">
          Paid tiers are coming soon. Join the waitlist to lock in early adopter pricing.
        </p>
      </div>

      <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
        {plans.map((plan) => (
          <PlanCard key={plan.name} plan={plan} />
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground/60">
        Billed monthly. No annual lock-in. Prices in USD.
      </p>
    </section>
  )
}
