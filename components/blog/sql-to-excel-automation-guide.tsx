import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SqlToExcelAutomationGuide() {
  return (
    <div className="space-y-6 text-sm leading-relaxed text-muted-foreground [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-medium [&_h2]:text-foreground [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:font-heading [&_h3]:text-base [&_h3]:font-medium [&_h3]:text-foreground [&_p]:leading-relaxed [&_strong]:font-medium [&_strong]:text-foreground [&_code]:rounded [&_code]:bg-white/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_code]:text-foreground">

      <p>
        Somebody needs a weekly Excel report from your database. It&apos;s SQL data. The query is
        straightforward. But turning that query into an Excel file, on a schedule, delivered to the
        right person&apos;s inbox — that&apos;s where it gets complicated.
      </p>

      <p>
        Here is every serious approach to SQL-to-Excel automation, with an honest look at what each
        one actually costs you.
      </p>

      <h2>Option 1: Do it manually</h2>

      <p>
        Run the query in your database client. Export to CSV. Open in Excel. Format. Save as .xlsx.
        Attach to email. Send.
      </p>

      <p>
        <strong>When it works:</strong> Once a month, for one person, with a query that never changes.
      </p>

      <p>
        <strong>When it breaks:</strong> You forget. The person emails you at 5 PM on Friday. The query
        changes and you update it wrong. You go on holiday and nobody else knows how to do it.
        It scales to zero.
      </p>

      <h2>Option 2: A Python script</h2>

      <p>
        The classic data engineer solution. A script that connects to the database, runs the query,
        writes the results to an Excel file using <code>openpyxl</code> or <code>pandas</code>, and
        sends it via <code>smtplib</code>. Runs as a cron job on a server or your laptop.
      </p>

      <p>
        <strong>Setup cost:</strong> A few hours. More if you want proper formatting, retry logic,
        error alerting, and the ability for non-engineers to modify the recipients.
      </p>

      <p>
        <strong>Ongoing cost:</strong> This is where it gets expensive. Python library updates break
        things quietly. Your SMTP credentials rotate and the script fails silently. The server needs
        patching. The cron job moves to a different machine. Someone modifies the query and breaks
        the column headers. You&apos;re on call for a reporting script forever.
      </p>

      <p>
        <strong>When it&apos;s the right call:</strong> When you need complex transformations, dynamic
        recipients, conditional logic, or multi-sheet workbooks with custom charts. When you have the
        infrastructure and the willingness to maintain it.
      </p>

      <h2>Option 3: A BI platform (PowerBI, Tableau, Looker)</h2>

      <p>
        Build a dashboard. Set up a subscription. Recipients get a PDF or image snapshot by email, or a
        link to the live dashboard.
      </p>

      <p>
        <strong>Setup cost:</strong> High. License costs, IT involvement for SSO, time to build and
        publish the dashboard, training for stakeholders.
      </p>

      <p>
        <strong>The core problem:</strong> BI platforms are designed for people who want to explore
        data interactively. Most stakeholders who want a weekly report just want the answer. They don&apos;t
        want to log in, apply filters, and interpret a chart. The adoption rate for BI dashboards at
        non-data-team stakeholders is consistently low. You end up maintaining the dashboard and still
        sending manual Excel exports when someone &quot;can&apos;t find the link.&quot;
      </p>

      <p>
        <strong>When it&apos;s the right call:</strong> When stakeholders genuinely need to explore and drill
        into data. When you have a real BI team and a data culture that supports it.
      </p>

      <h2>Option 4: Scheduled SQL report delivery tools</h2>

      <p>
        A newer category of tools built specifically for this workflow: connect a database, write a
        SQL query, set a schedule, and the tool handles the rest — running the query on time, formatting
        the output as Excel, and sending it to the recipients you configure.
      </p>

      <p>
        <strong>Setup cost:</strong> Minutes. No server, no script, no BI platform.
      </p>

      <p>
        <strong>Ongoing cost:</strong> Near zero. There is no script to maintain. Infrastructure is
        managed. When the query needs to change, you update it in the UI.
      </p>

      <p>
        <strong>What you give up:</strong> Custom transformations beyond what SQL can express. Multi-sheet
        dynamic workbooks. Conditional logic about when to send. If your report needs complex business
        logic baked in, a script may still be necessary.
      </p>

      <p>
        <strong>When it&apos;s the right call:</strong> When the report is a SQL query that produces rows
        you want to send as Excel. When your stakeholders want data in their inbox, not a dashboard.
        When you want to stop being the person who maintains the reporting pipeline forever.
      </p>

      <h2>Choosing the right approach</h2>

      <p>
        The honest framework: match the tool to the complexity of the requirement and your willingness
        to own infrastructure.
      </p>

      <ul className="ml-4 list-disc space-y-2">
        <li>Simple tabular report, recurring schedule, no transformations → <strong>scheduled delivery tool</strong></li>
        <li>Complex transformations, dynamic logic, multi-sheet workbooks → <strong>Python script</strong></li>
        <li>Stakeholders who want to explore and self-serve → <strong>BI platform</strong></li>
        <li>One-off, never changes, very low frequency → <strong>manual is fine</strong></li>
      </ul>

      <p>
        Most of the reports data engineers get asked to build fall into the first category. A SQL
        query, on a schedule, as an Excel file. For that, a scheduled delivery tool removes the
        infrastructure entirely and lets you focus on the query.
      </p>

      <div className="mt-12 rounded-xl border border-primary/20 bg-primary/5 p-6">
        <p className="mb-4 font-heading text-sm font-medium text-foreground">
          Query2Mail is built for option 4.
        </p>
        <p className="mb-6 text-xs text-muted-foreground">
          Connect PostgreSQL or MySQL, write the SQL, pick a schedule. Excel goes to any inbox automatically.
          No Python, no server, no maintenance.
        </p>
        <Button size="sm" asChild>
          <Link href="/login">Try it free →</Link>
        </Button>
      </div>
    </div>
  )
}
