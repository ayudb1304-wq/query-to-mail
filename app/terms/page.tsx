import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
}

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="mb-12 text-xs text-muted-foreground">
          Last updated: March 24, 2025
        </p>

        <div className="prose prose-sm prose-invert max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:font-heading [&_h2]:text-base [&_h2]:font-medium [&_h2]:text-foreground [&_ul]:ml-4 [&_ul]:list-disc [&_ul]:space-y-1">

          <p>
            By accessing or using Query2Mail (&quot;the Service&quot;), you agree to be bound
            by these Terms of Service. If you do not agree, do not use the Service.
          </p>

          <h2>1. The Service</h2>
          <p>
            Query2Mail allows users to connect a database, write SQL queries, schedule them, and deliver the results as formatted Excel files via email. The Service is provided as-is during the free early access period.
          </p>

          <h2>2. Eligibility</h2>
          <p>
            You must be at least 16 years old and have the legal authority to enter into these terms on behalf of yourself or your organization. By using the Service, you represent that you meet these requirements.
          </p>

          <h2>3. Acceptable Use</h2>
          <p>You agree not to use the Service to:</p>
          <ul>
            <li>Connect to databases you do not own or have explicit permission to access</li>
            <li>Send unsolicited emails or spam to report recipients</li>
            <li>Attempt to reverse-engineer, scrape, or otherwise abuse the Service infrastructure</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Transmit malicious code or interfere with the Service</li>
          </ul>
          <p>
            We reserve the right to suspend or terminate accounts that violate these terms without notice.
          </p>

          <h2>4. Your Data & Credentials</h2>
          <p>
            You are solely responsible for the database credentials and queries you provide. You represent that you have authorization to access any database you connect. Query2Mail encrypts your credentials at rest but cannot guarantee security against all threats — use a read-only database user for report queries wherever possible.
          </p>

          <h2>5. Email Delivery</h2>
          <p>
            You are responsible for ensuring that report recipients have consented to receive emails from you via Query2Mail. Do not use the Service to send reports to recipients who have not agreed to receive them.
          </p>

          <h2>6. Availability & Uptime</h2>
          <p>
            The Service is provided on a best-effort basis during the free early access period. We do not guarantee uninterrupted availability or a specific uptime SLA at this stage. Scheduled jobs that fail to execute will be logged for your review.
          </p>

          <h2>7. Intellectual Property</h2>
          <p>
            Query2Mail and its original content, features, and functionality are owned by us and protected by applicable intellectual property law. Your data — including your queries, connection configurations, and report content — remains yours.
          </p>

          <h2>8. Pricing & Billing</h2>
          <p>
            The Service is currently free during the early access period. When paid tiers launch, pricing will be communicated to registered users in advance. Early adopters who join the waitlist are eligible for locked-in discounted pricing as described on the landing page. Specific pricing terms will be set out at the time of launch.
          </p>

          <h2>9. Termination</h2>
          <p>
            You may delete your account at any time from the Settings page. We may suspend or terminate your access for violations of these terms. Upon termination, your data will be deleted within 30 days as described in our Privacy Policy.
          </p>

          <h2>10. Disclaimer of Warranties</h2>
          <p>
            THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE ERROR-FREE, UNINTERRUPTED, OR FREE OF SECURITY VULNERABILITIES.
          </p>

          <h2>11. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, QUERY2MAIL SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE SERVICE, INCLUDING BUT NOT LIMITED TO LOSS OF DATA, REVENUE, OR BUSINESS OPPORTUNITIES.
          </p>

          <h2>12. Changes to These Terms</h2>
          <p>
            We may update these Terms of Service from time to time. We will notify registered users of material changes via email. Continued use of the Service after changes take effect constitutes acceptance of the new terms.
          </p>

          <h2>13. Governing Law</h2>
          <p>
            These terms are governed by the laws of the jurisdiction in which Query2Mail operates, without regard to conflict of law principles.
          </p>

          <h2>14. Contact</h2>
          <p>
            Questions about these Terms?{" "}
            <a href="mailto:legal@query2mail.com" className="text-primary hover:underline">
              legal@query2mail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
