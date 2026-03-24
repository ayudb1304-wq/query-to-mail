import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

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
      </div>

      <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={
              plan.featured
                ? "border-primary/40 bg-card relative"
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
              <p className="font-heading text-xs text-muted-foreground">
                {plan.name}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-4xl font-medium text-foreground">
                  {plan.price}
                </span>
                <span className="text-xs text-muted-foreground">/month</span>
              </div>
              <p className="text-xs text-muted-foreground">{plan.description}</p>
            </CardHeader>

            <Separator className="opacity-10" />

            <CardContent className="pt-4 pb-6">
              <ul className="mb-6 flex flex-col gap-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="text-primary">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.featured ? "default" : "outline"}
                asChild
              >
                <Link href="#waitlist">Join waitlist</Link>
              </Button>
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
