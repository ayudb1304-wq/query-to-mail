import { Card, CardContent } from "@/components/ui/card"

const pains = [
  {
    emoji: "💸",
    title: "The BI platform nobody uses",
    body: "You bought PowerBI or Tableau. You set it up. You built the dashboards. Your stakeholders opened it twice, then went back to asking you for Excel files.",
  },
  {
    emoji: "🔧",
    title: "The fragile script",
    body: "You wrote the Python cron job. Then fixed it when pandas broke. Then again when the SMTP relay changed. Then again at 7am on a Monday because production was down.",
  },
  {
    emoji: "📬",
    title: "The Friday inbox panic",
    body: "\"Can you send me last week's numbers?\" It's 4:58pm. You're already checked out. But you run the query, export the file, format the sheet, and hit send. Again.",
  },
]

export function PainSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-16 text-center">
        <p className="mb-4 font-heading text-xs tracking-widest text-primary uppercase">
          The problem
        </p>
        <h2 className="font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
          You&apos;ve been the accidental BI developer
          <br />
          <span className="text-muted-foreground">for long enough.</span>
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {pains.map((pain) => (
          <Card
            key={pain.title}
            className="border-white/8 bg-card/50 backdrop-blur-sm transition-colors hover:border-white/15"
          >
            <CardContent className="p-6">
              <div className="mb-4 text-2xl">{pain.emoji}</div>
              <h3 className="mb-2 font-heading text-sm font-medium text-foreground">
                {pain.title}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {pain.body}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
