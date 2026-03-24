export type BlogPost = {
  slug: string
  title: string
  description: string
  publishedAt: string
  readingTime: string
  tags: string[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: "why-teams-stop-using-bi-dashboards",
    title: "Why Your Team Stops Using the BI Dashboard After 3 Weeks",
    description:
      "You built the dashboards. You did the training. Three weeks later, nobody logs in. Here's why BI tools fail for most stakeholder reporting — and what actually works.",
    publishedAt: "2025-03-24",
    readingTime: "5 min read",
    tags: ["BI tools", "stakeholder reporting", "data engineering"],
  },
  {
    slug: "sql-to-excel-automation-guide",
    title: "SQL to Excel Automation: The Complete Guide for Data Engineers",
    description:
      "A practical walkthrough of every approach to automating SQL-to-Excel reporting: manual exports, Python scripts, BI platforms, and modern scheduled delivery tools.",
    publishedAt: "2025-03-24",
    readingTime: "7 min read",
    tags: ["SQL", "Excel", "automation", "data engineering"],
  },
  {
    slug: "postgresql-scheduled-reports",
    title: "PostgreSQL Scheduled Email Reports: A Step-by-Step Guide",
    description:
      "How to set up automated PostgreSQL reports that run on a schedule and land in stakeholders' inboxes as formatted Excel files — without maintaining any infrastructure.",
    publishedAt: "2025-03-24",
    readingTime: "6 min read",
    tags: ["PostgreSQL", "scheduled reports", "email automation"],
  },
]

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug)
}
