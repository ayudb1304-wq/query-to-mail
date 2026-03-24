import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-12">
          <Link
            href="/"
            className="font-heading text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Query<span className="text-primary">2</span>Mail
          </Link>
        </div>

        <h1 className="mb-2 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mb-12 text-xs text-muted-foreground">
          Last updated: March 24, 2025
        </p>

        <div className="prose prose-sm prose-invert max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:font-heading [&_h2]:text-base [&_h2]:font-medium [&_h2]:text-foreground [&_ul]:ml-4 [&_ul]:list-disc [&_ul]:space-y-1">

          <p>
            Query2Mail (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates query2mail.com. This Privacy
            Policy explains how we collect, use, and protect your information when
            you use our service.
          </p>

          <h2>Information We Collect</h2>
          <p>
            We collect information you provide directly to us:
          </p>
          <ul>
            <li>
              <strong className="text-foreground">Account information</strong> — email address used to sign in via magic link
            </li>
            <li>
              <strong className="text-foreground">Database credentials</strong> — host, port, username, password, and database name for connections you create. All credentials are encrypted with AES-256 at rest and never exposed client-side.
            </li>
            <li>
              <strong className="text-foreground">Query content</strong> — SQL queries you write and schedule within the app
            </li>
            <li>
              <strong className="text-foreground">Recipient email addresses</strong> — email addresses you configure to receive reports
            </li>
            <li>
              <strong className="text-foreground">Waitlist email</strong> — if you submit your email on our early access form
            </li>
          </ul>

          <h2>How We Use Your Information</h2>
          <ul>
            <li>To run your scheduled SQL queries and deliver reports to the inboxes you specify</li>
            <li>To authenticate you and maintain your session</li>
            <li>To send you transactional emails (magic link sign-ins, report delivery confirmations)</li>
            <li>To notify waitlist subscribers when paid tiers launch</li>
            <li>To monitor service health and debug execution failures</li>
          </ul>

          <h2>Data Storage & Security</h2>
          <p>
            Your data is stored in Supabase (PostgreSQL), hosted on AWS infrastructure in the United States. Database credentials are encrypted with AES-256 before storage. We do not sell, rent, or share your personal information or your database credentials with third parties.
          </p>
          <p>
            Query results are processed in memory to generate Excel files and are not stored permanently. Large files may be temporarily stored in Supabase Storage with signed URLs and are automatically cleaned up.
          </p>

          <h2>Third-Party Services</h2>
          <p>We use the following third-party services to operate Query2Mail:</p>
          <ul>
            <li><strong className="text-foreground">Supabase</strong> — database, authentication, and file storage</li>
            <li><strong className="text-foreground">Resend</strong> — transactional email delivery</li>
            <li><strong className="text-foreground">Vercel</strong> — hosting and serverless functions</li>
          </ul>
          <p>
            Each of these services has its own privacy policy. We only share the minimum data necessary for each service to function.
          </p>

          <h2>Cookies & Tracking</h2>
          <p>
            We use cookies only for session authentication (Supabase Auth). We do not use advertising cookies or cross-site tracking. If analytics are present, they are privacy-preserving (aggregated, no personal data).
          </p>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request deletion of your account and associated data</li>
            <li>Export your query and connection configuration</li>
            <li>Unsubscribe from waitlist emails at any time</li>
          </ul>
          <p>
            To exercise these rights, email us at{" "}
            <a href="mailto:privacy@query2mail.com" className="text-primary hover:underline">
              privacy@query2mail.com
            </a>
            .
          </p>

          <h2>Data Retention</h2>
          <p>
            We retain your account data for as long as your account is active. Job execution logs are retained for 90 days. If you delete your account, all associated data — including database credentials, queries, and logs — is permanently deleted within 30 days.
          </p>

          <h2>Children&apos;s Privacy</h2>
          <p>
            Query2Mail is not intended for use by anyone under the age of 16. We do not knowingly collect personal information from children.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify registered users of significant changes via email. Continued use of the service after changes constitutes acceptance of the updated policy.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this Privacy Policy? Contact us at{" "}
            <a href="mailto:privacy@query2mail.com" className="text-primary hover:underline">
              privacy@query2mail.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
