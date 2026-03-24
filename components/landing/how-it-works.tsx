const steps = [
  {
    number: "01",
    title: "Connect your database",
    body: "Add a read-only PostgreSQL or MySQL connection. Credentials are encrypted with AES-256 and never exposed.",
  },
  {
    number: "02",
    title: "Write your query, set a schedule",
    body: "Paste your SQL. Choose daily, weekly, or monthly. Add the recipient email addresses. Done.",
  },
  {
    number: "03",
    title: "Stakeholders get Excel in their inbox",
    body: "At the scheduled time, Query2Mail runs the query, formats the results into a clean Excel file, and sends it. No action required on their end.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-16 text-center">
        <p className="mb-4 font-heading text-xs tracking-widest text-primary uppercase">
          How it works
        </p>
        <h2 className="font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
          Three steps.
          <br />
          <span className="text-muted-foreground">Then it runs itself.</span>
        </h2>
      </div>

      <div className="relative">
        {/* Connecting line (desktop) */}
        <div className="absolute top-6 left-0 right-0 hidden h-px bg-gradient-to-r from-transparent via-white/10 to-transparent sm:block" />

        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                  <span className="font-heading text-xs font-medium text-primary">
                    {step.number}
                  </span>
                </div>
              </div>
              <h3 className="font-heading text-sm font-medium text-foreground">
                {step.title}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Inline code visual */}
      <div className="mt-16 rounded-xl border border-white/8 bg-card/50 p-6 font-mono text-xs">
        <p className="mb-1 text-muted-foreground/60">{`-- Your query. Run on schedule. Emailed as Excel.`}</p>
        <p>
          <span className="text-primary">SELECT</span>
          <span className="text-foreground">
            {" "}
            region, SUM(revenue) as total_revenue, COUNT(*) as orders
          </span>
        </p>
        <p>
          <span className="text-primary">FROM</span>
          <span className="text-foreground"> sales</span>
        </p>
        <p>
          <span className="text-primary">WHERE</span>
          <span className="text-foreground">
            {" "}
            created_at &gt;= date_trunc(
          </span>
          <span className="text-primary">&apos;week&apos;</span>
          <span className="text-foreground">, now())</span>
        </p>
        <p>
          <span className="text-primary">GROUP BY</span>
          <span className="text-foreground"> region</span>
        </p>
        <p>
          <span className="text-primary">ORDER BY</span>
          <span className="text-foreground"> total_revenue </span>
          <span className="text-primary">DESC</span>
          <span className="text-foreground">;</span>
        </p>
        <p className="mt-4 text-muted-foreground/40">
          {`→ Runs every Monday at 8:00 AM → Emailed to ops@company.com`}
        </p>
      </div>
    </section>
  )
}
