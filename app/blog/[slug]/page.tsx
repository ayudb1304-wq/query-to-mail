import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { blogPosts, getPost } from "@/lib/blog"
import { PublicHeader } from "@/components/public-header"
import { WhyTeamsStopUsingBIDashboards } from "@/components/blog/why-teams-stop-using-bi-dashboards"
import { SqlToExcelAutomationGuide } from "@/components/blog/sql-to-excel-automation-guide"
import { PostgresqlScheduledReports } from "@/components/blog/postgresql-scheduled-reports"

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://query2mail.com/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      tags: post.tags,
    },
  }
}

const postComponents: Record<string, React.ComponentType> = {
  "why-teams-stop-using-bi-dashboards": WhyTeamsStopUsingBIDashboards,
  "sql-to-excel-automation-guide": SqlToExcelAutomationGuide,
  "postgresql-scheduled-reports": PostgresqlScheduledReports,
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const PostContent = postComponents[slug]
  if (!PostContent) notFound()

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: "Query2Mail" },
    publisher: { "@type": "Organization", name: "Query2Mail", url: "https://query2mail.com" },
    url: `https://query2mail.com/blog/${post.slug}`,
  }

  return (
    <div className="min-h-svh bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <PublicHeader />

      <article className="mx-auto max-w-2xl px-6 pb-24 pt-32">
        {/* Header */}
        <header className="mb-12">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 font-heading text-[10px] text-primary"
              >
                {tag}
              </span>
            ))}
            <span className="text-[10px] text-muted-foreground/60">{post.readingTime}</span>
          </div>
          <h1 className="mb-4 font-heading text-3xl font-medium leading-tight tracking-tight text-foreground sm:text-4xl">
            {post.title}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">{post.description}</p>
        </header>

        {/* Content */}
        <div className="prose-blog">
          <PostContent />
        </div>
      </article>
    </div>
  )
}
