import Link from "next/link"
import { Button } from "@/components/ui/button"

export function WhyTeamsStopUsingBIDashboards() {
  return (
    <div className="space-y-6 text-sm leading-relaxed text-muted-foreground [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-medium [&_h2]:text-foreground [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:font-heading [&_h3]:text-base [&_h3]:font-medium [&_h3]:text-foreground [&_p]:leading-relaxed [&_strong]:font-medium [&_strong]:text-foreground">

      <p>
        You spent two weeks building dashboards in PowerBI. You created slicers, set up refresh schedules,
        wrote DAX measures that took a full afternoon to figure out. You did a training session. You
        sent the link around. You got a handful of "looks great!" replies.
      </p>

      <p>
        Three weeks later, nobody logs in. And your manager is still emailing you for Excel files.
      </p>

      <p>
        This is not a PowerBI problem. It is not a Tableau problem. It is a fundamental mismatch between
        how BI tools are designed and how most stakeholders actually want to consume data.
      </p>

      <h2>The adoption problem nobody talks about</h2>

      <p>
        BI platforms are built around a pull model: stakeholders go to the dashboard when they want data.
        This works when the dashboard is part of someone&apos;s daily workflow — a trader checking positions,
        a support lead watching queue depth, an analyst who lives in data.
      </p>

      <p>
        But for most stakeholders — finance managers, operations leads, department heads, executives —
        the data is a means to an end. They don&apos;t want a dashboard. They want an answer, delivered to
        them, at a time when they need it. Making them pull the data adds friction. That friction
        compounds into abandonment.
      </p>

      <h3>The login barrier</h3>
      <p>
        Every BI platform requires a login. Licenses cost money. SSO setup takes IT involvement. Password
        resets happen. Two-factor codes get lost. Each of these is a small tax on using the dashboard,
        and small taxes compound into avoidance. Your stakeholders default to the path of least resistance:
        emailing you.
      </p>

      <h3>The cognitive overhead</h3>
      <p>
        Even well-built dashboards require interpretation. Stakeholders have to navigate, apply filters,
        understand what the numbers mean in context, and decide what to export. For a weekly revenue
        summary, this is more effort than opening a well-formatted Excel file that landed in their inbox.
      </p>

      <h3>The trust gap</h3>
      <p>
        Stakeholders often distrust dashboards because they&apos;ve been burned before — a stale refresh,
        a filter left in the wrong state by the last user, a number that didn&apos;t match the report from last quarter.
        Excel files feel more tangible and auditable. "I have a copy of the numbers" is worth something to them.
      </p>

      <h2>The push model works better for most stakeholders</h2>

      <p>
        The difference between a pull model (dashboard) and a push model (scheduled email report) is
        not just UX preference. It maps to how different people work.
      </p>

      <p>
        A dashboard is right for someone who checks data reactively — who needs to drill in, compare
        dimensions, and explore. A scheduled email report is right for someone who needs a regular
        summary to make a decision or stay informed — and who otherwise has no reason to open a BI tool.
      </p>

      <p>
        Most of the people asking you for data are in the second category. They want the answer in
        their inbox on Monday morning, not a link to a dashboard they&apos;ll forget the URL for.
      </p>

      <h2>What actually sticks</h2>

      <p>
        The reporting workflows that survive in most organizations are the ones that require nothing
        from the recipient. A report that just appears in your inbox at a predictable time, in a format
        you already know how to use, is frictionless by design.
      </p>

      <p>
        This is why automated email reports — unfashionable as they sound — outlast most BI
        implementations at mid-sized companies. They work because they meet stakeholders where they already are.
      </p>

      <p>
        The best version of this isn&apos;t a Python cron job you have to maintain forever. It&apos;s a system
        where you write the SQL once, set a schedule, and the right person gets the right data every week
        without either of you having to do anything.
      </p>

      <div className="mt-12 rounded-xl border border-primary/20 bg-primary/5 p-6">
        <p className="mb-4 font-heading text-sm font-medium text-foreground">
          Query2Mail does exactly this.
        </p>
        <p className="mb-6 text-xs text-muted-foreground">
          Connect your database, write the query, set a schedule. Your stakeholders get a formatted
          Excel file in their inbox on time — without logging in to anything.
        </p>
        <Button size="sm" asChild>
          <Link href="/login">Try it free →</Link>
        </Button>
      </div>
    </div>
  )
}
