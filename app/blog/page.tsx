import type { Metadata } from "next"
import Link from "next/link"
import { blogPosts } from "@/lib/blog"
import { PublicHeader } from "@/components/public-header"

export const metadata: Metadata = {
  title: "Blog — Data Engineering & Automated Reporting",
  description:
    "Practical guides for data engineers on SQL automation, stakeholder reporting, and escaping the accidental BI developer trap.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog — Query2Mail",
    description:
      "Practical guides for data engineers on SQL automation, stakeholder reporting, and escaping the accidental BI developer trap.",
    url: "https://query2mail.com/blog",
  },
}

export default function BlogPage() {
  return (
    <div className="min-h-svh bg-background">
      <PublicHeader />

      <section className="relative overflow-hidden px-6 pb-16 pt-32">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-4 font-heading text-xs tracking-widest text-primary uppercase">
            Blog
          </p>
          <h1 className="mb-4 font-heading text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            For data engineers
            <br />
            <span className="text-muted-foreground">who have seen it all.</span>
          </h1>
          <p className="text-base text-muted-foreground">
            Practical guides on SQL automation, stakeholder reporting, and getting your weekends back.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="space-y-4">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-xl border border-white/8 bg-card/50 p-6 backdrop-blur-sm transition-colors hover:border-white/15"
            >
              <div className="mb-3 flex items-center gap-3">
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
              <h2 className="mb-2 font-heading text-base font-medium text-foreground transition-colors group-hover:text-primary">
                {post.title}
              </h2>
              <p className="text-xs leading-relaxed text-muted-foreground">{post.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
