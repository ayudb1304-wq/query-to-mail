const faqs = [
  {
    question: "Does my stakeholder need to log in to receive reports?",
    answer:
      "No. Reports are delivered directly to their inbox as Excel attachments. They never touch Query2Mail — no account, no dashboard, no login required.",
  },
  {
    question: "Which databases does Query2Mail support?",
    answer:
      "Query2Mail currently supports PostgreSQL and MySQL. More database types are on the roadmap — connect your database in minutes with standard credentials.",
  },
  {
    question: "How is my database connection secured?",
    answer:
      "All database credentials are encrypted with AES-256 before storage. Connections are never exposed client-side and credentials are never logged or transmitted in plaintext.",
  },
  {
    question: "What happens if a query fails?",
    answer:
      "Failed jobs are logged with the full error message so you can debug immediately. You can also trigger any job manually from the dashboard to re-run it on demand.",
  },
  {
    question: "Can I control how the Excel output is formatted?",
    answer:
      "Yes. Query2Mail auto-formats columns based on data types — dates, numbers, and strings are styled appropriately. Custom formatting options are on the roadmap.",
  },
  {
    question: "How is this different from PowerBI or Tableau?",
    answer:
      "BI platforms require your stakeholders to log in, learn a UI, and pull their own data. Query2Mail pushes the answer to their inbox automatically. No dashboards, no training, no login — just an Excel file in their email when they need it.",
  },
]

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
}

export function Faq() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mb-16 text-center">
        <p className="mb-4 font-heading text-xs tracking-widest text-primary uppercase">
          FAQ
        </p>
        <h2 className="font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
          Common questions
        </h2>
      </div>

      <div className="space-y-2">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group rounded-lg border border-white/8 bg-card/50 backdrop-blur-sm open:border-white/15"
          >
            <summary className="flex cursor-pointer select-none items-center justify-between gap-4 px-5 py-4 font-heading text-sm font-medium text-foreground marker:content-none">
              {faq.question}
              <span className="shrink-0 text-muted-foreground transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="px-5 pb-4 text-xs leading-relaxed text-muted-foreground">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}
