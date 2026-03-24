import Link from "next/link"
import { Button } from "@/components/ui/button"

export function PostgresqlScheduledReports() {
  return (
    <div className="space-y-6 text-sm leading-relaxed text-muted-foreground [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-medium [&_h2]:text-foreground [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:font-heading [&_h3]:text-base [&_h3]:font-medium [&_h3]:text-foreground [&_p]:leading-relaxed [&_strong]:font-medium [&_strong]:text-foreground [&_code]:rounded [&_code]:bg-white/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_code]:text-foreground">

      <p>
        You have a PostgreSQL database. Someone needs a weekly report from it. They want an Excel file
        in their inbox every Monday morning. They don&apos;t want to log in anywhere. They just want the file.
      </p>

      <p>
        This guide covers the practical ways to make that happen — including which approach is worth
        your time depending on your constraints.
      </p>

      <h2>What &quot;scheduled PostgreSQL report&quot; actually means</h2>

      <p>
        The workflow has three parts:
      </p>

      <ul className="ml-4 list-disc space-y-2">
        <li><strong>Trigger:</strong> something decides it&apos;s time to run the report (a cron schedule)</li>
        <li><strong>Execution:</strong> a PostgreSQL connection runs the SQL query and returns rows</li>
        <li><strong>Delivery:</strong> the rows are formatted as Excel and sent to an email address</li>
      </ul>

      <p>
        Simple in concept. Where complexity creeps in is in the plumbing between these three parts —
        handling connection errors, formatting the Excel file correctly, managing SMTP credentials,
        and keeping all of this running without attention.
      </p>

      <h2>Option A: pg_cron + a custom email script</h2>

      <p>
        PostgreSQL has a <code>pg_cron</code> extension that can schedule SQL functions to run on a
        cron schedule directly inside the database. You can write a function that runs the query and
        uses <code>pg_sendmail</code> (via a wrapper) to deliver results.
      </p>

      <p>
        <strong>Pros:</strong> Everything lives in the database. No external dependencies for scheduling.
      </p>

      <p>
        <strong>Cons:</strong> <code>pg_cron</code> is not available on all managed PostgreSQL providers.
        Formatting output as a proper Excel file inside PostgreSQL is painful. Email delivery from
        inside a database is fragile and limited. Not recommended for production reporting pipelines.
      </p>

      <h2>Option B: A Python script on a cron job</h2>

      <p>
        The most common DIY approach. A Python script uses <code>psycopg2</code> to connect to PostgreSQL,
        runs the query, writes results to an Excel file with <code>openpyxl</code> or <code>pandas + xlsxwriter</code>,
        and sends it via <code>smtplib</code> or a transactional email API.
      </p>

      <h3>Basic structure</h3>
      <div className="rounded-lg border border-white/8 bg-card/50 p-4 font-mono text-xs">
        <p className="mb-1 text-muted-foreground/60"># Simplified structure</p>
        <p><span className="text-primary">import</span> psycopg2, openpyxl, smtplib</p>
        <p className="mt-2"><span className="text-primary">conn</span> = psycopg2.connect(DATABASE_URL)</p>
        <p><span className="text-primary">cursor</span> = conn.cursor()</p>
        <p>cursor.execute(<span className="text-primary">&quot;SELECT ...&quot;</span>)</p>
        <p className="mt-2"><span className="text-muted-foreground/60"># Write rows to Excel</span></p>
        <p><span className="text-muted-foreground/60"># Send via SMTP</span></p>
        <p><span className="text-muted-foreground/60"># Handle errors, retries, logging...</span></p>
      </div>

      <p>
        <strong>What it costs you:</strong> A few hours to build correctly. Then ongoing maintenance
        when dependencies update, SMTP credentials rotate, the PostgreSQL host moves, or column names
        in the query change. This script will need attention over its lifetime.
      </p>

      <p>
        <strong>When to use it:</strong> When you need custom Excel formatting, multi-sheet workbooks,
        conditional send logic, or transformations that go beyond SQL.
      </p>

      <h2>Option C: A scheduled SQL report delivery tool</h2>

      <p>
        Tools like Query2Mail are purpose-built for this workflow. You connect your PostgreSQL database,
        write the SQL query, configure a schedule and recipient list, and the tool handles execution,
        Excel generation, and email delivery — on managed infrastructure.
      </p>

      <h3>What this looks like in practice</h3>

      <p>
        <strong>1. Connect your database.</strong> Provide the host, port, database name, username,
        and password. Use a read-only role — you only need SELECT access for reporting. Credentials
        are encrypted immediately.
      </p>

      <p>
        <strong>2. Write your query.</strong> Any SELECT statement that runs in psql will work here.
        CTEs, window functions, JSON aggregation — whatever your query needs.
      </p>

      <div className="rounded-lg border border-white/8 bg-card/50 p-4 font-mono text-xs">
        <p className="mb-1 text-muted-foreground/60">-- Weekly revenue by region</p>
        <p><span className="text-primary">SELECT</span> region,</p>
        <p className="pl-4">SUM(revenue) <span className="text-primary">AS</span> total_revenue,</p>
        <p className="pl-4">COUNT(*) <span className="text-primary">AS</span> order_count,</p>
        <p className="pl-4">AVG(revenue) <span className="text-primary">AS</span> avg_order_value</p>
        <p><span className="text-primary">FROM</span> orders</p>
        <p><span className="text-primary">WHERE</span> created_at &gt;= date_trunc(<span className="text-primary">&apos;week&apos;</span>, now())</p>
        <p><span className="text-primary">GROUP BY</span> region</p>
        <p><span className="text-primary">ORDER BY</span> total_revenue <span className="text-primary">DESC</span>;</p>
      </div>

      <p>
        <strong>3. Set a schedule.</strong> Daily at 7 AM, weekly on Mondays, monthly on the first.
        The tool runs it at the configured time regardless of whether you&apos;re around.
      </p>

      <p>
        <strong>4. Add recipients.</strong> Email addresses of anyone who should receive the report.
        They receive an Excel file attachment. No login required, no account needed.
      </p>

      <h3>Security considerations for PostgreSQL connections</h3>

      <p>
        Before connecting any external tool to a production PostgreSQL database, create a dedicated
        read-only role:
      </p>

      <div className="rounded-lg border border-white/8 bg-card/50 p-4 font-mono text-xs">
        <p><span className="text-primary">CREATE ROLE</span> reporting_user <span className="text-primary">WITH</span> LOGIN PASSWORD <span className="text-primary">&apos;strong-password&apos;</span>;</p>
        <p><span className="text-primary">GRANT CONNECT ON DATABASE</span> your_db <span className="text-primary">TO</span> reporting_user;</p>
        <p><span className="text-primary">GRANT USAGE ON SCHEMA</span> public <span className="text-primary">TO</span> reporting_user;</p>
        <p><span className="text-primary">GRANT SELECT ON</span> specific_table <span className="text-primary">TO</span> reporting_user;</p>
      </div>

      <p>
        Only grant SELECT access to the tables your report queries need. Use a dedicated reporting
        schema if possible. This limits the blast radius if credentials are ever compromised.
      </p>

      <h2>Which approach is right for your situation</h2>

      <p>
        Use a Python script if you need: custom Excel formatting (colours, merged cells, charts),
        complex business logic beyond SQL, multi-sheet workbooks, or conditional send logic.
      </p>

      <p>
        Use a scheduled delivery tool if you need: a SELECT query formatted as Excel, delivered to
        an inbox on a schedule, with no infrastructure to maintain. This covers the majority of
        stakeholder reporting requests.
      </p>

      <div className="mt-12 rounded-xl border border-primary/20 bg-primary/5 p-6">
        <p className="mb-4 font-heading text-sm font-medium text-foreground">
          Try Query2Mail with your PostgreSQL database.
        </p>
        <p className="mb-6 text-xs text-muted-foreground">
          Connect in minutes. Write your query. Set a schedule. Excel lands in any inbox automatically.
          No infrastructure required.
        </p>
        <Button size="sm" asChild>
          <Link href="/integrations/postgresql">Learn about the PostgreSQL integration →</Link>
        </Button>
      </div>
    </div>
  )
}
