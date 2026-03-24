"use client"

import { Check } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
          Paid tiers are coming soon.{" "}
          <a
            href="#early-access"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById("early-access")?.scrollIntoView({ behavior: "smooth" })
            }}
            className="text-primary underline underline-offset-4 hover:text-primary/80 cursor-pointer"
          >
            Join early to lock in discounted pricing.
          </a>
        </p>
      </div>

      <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={
              plan.featured
                ? "border-primary/40 bg-card"
                : "border-white/8 bg-card/50"
            }
          >
            <CardHeader className="pb-4 pt-6">
              <div className="flex items-center gap-2">
                <p className="font-heading text-xs text-muted-foreground">{plan.name}</p>
                {plan.featured && (
                  <Badge variant="secondary" className="border border-white/10 bg-white/5 text-[10px] text-muted-foreground">
                    Coming soon
                  </Badge>
                )}
              </div>
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
              <ul className="flex flex-col gap-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground/60">
        Billed monthly. No annual lock-in. Prices in USD.
      </p>
    </section>
  )
}
