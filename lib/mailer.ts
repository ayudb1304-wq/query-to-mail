import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev"
const LARGE_FILE_THRESHOLD = 20 * 1024 * 1024 // 20MB

interface SendReportOptions {
  jobName: string
  recipients: string[]
  buffer: Buffer
  rowCount: number
  dateLabel: string  // e.g. "2025-03-24"
  downloadUrl?: string // pre-signed URL (only set if file is large)
}

function buildFilename(jobName: string, date: string) {
  const safe = jobName.replace(/[^a-z0-9]/gi, "_").replace(/_+/g, "_")
  return `${safe}_${date}.xlsx`
}

function attachmentEmail(jobName: string, date: string, rowCount: number) {
  return `
<!DOCTYPE html>
<html>
<body style="font-family: monospace; background: #0a0a0a; color: #e5e5e5; padding: 32px;">
  <div style="max-width: 520px; margin: 0 auto;">
    <p style="color: #a3a3a3; font-size: 11px; margin-bottom: 24px;">QUERY2MAIL</p>
    <h1 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">${jobName}</h1>
    <p style="color: #a3a3a3; font-size: 13px; margin-bottom: 24px;">${date} &mdash; ${rowCount.toLocaleString()} rows</p>
    <p style="font-size: 13px; color: #d4d4d4;">Your scheduled report is attached as an Excel file.</p>
    <hr style="border: none; border-top: 1px solid #262626; margin: 32px 0;" />
    <p style="font-size: 11px; color: #525252;">Sent automatically by Query2Mail. To unsubscribe, contact the sender.</p>
  </div>
</body>
</html>`
}

function linkEmail(jobName: string, date: string, rowCount: number, url: string) {
  return `
<!DOCTYPE html>
<html>
<body style="font-family: monospace; background: #0a0a0a; color: #e5e5e5; padding: 32px;">
  <div style="max-width: 520px; margin: 0 auto;">
    <p style="color: #a3a3a3; font-size: 11px; margin-bottom: 24px;">QUERY2MAIL</p>
    <h1 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">${jobName}</h1>
    <p style="color: #a3a3a3; font-size: 13px; margin-bottom: 24px;">${date} &mdash; ${rowCount.toLocaleString()} rows</p>
    <p style="font-size: 13px; color: #d4d4d4; margin-bottom: 24px;">
      Your report is ready. Due to its size it wasn&rsquo;t attached directly &mdash; download it using the link below.
    </p>
    <a href="${url}" style="display:inline-block; background:#ca8a04; color:#0a0a0a; font-size:13px; font-weight:600; padding:10px 20px; text-decoration:none; border-radius:4px;">
      Download report
    </a>
    <p style="margin-top: 16px; font-size: 11px; color: #525252;">Link expires in 48 hours.</p>
    <hr style="border: none; border-top: 1px solid #262626; margin: 32px 0;" />
    <p style="font-size: 11px; color: #525252;">Sent automatically by Query2Mail. To unsubscribe, contact the sender.</p>
  </div>
</body>
</html>`
}

export async function sendReport(options: SendReportOptions): Promise<"attachment" | "link"> {
  const { jobName, recipients, buffer, rowCount, dateLabel, downloadUrl } = options
  const filename = buildFilename(jobName, dateLabel)

  if (buffer.length < LARGE_FILE_THRESHOLD && !downloadUrl) {
    // Small file — attach directly
    await resend.emails.send({
      from: FROM,
      to: recipients,
      subject: `[Query2Mail] ${jobName} — ${dateLabel}`,
      html: attachmentEmail(jobName, dateLabel, rowCount),
      attachments: [{ filename, content: buffer }],
    })
    return "attachment"
  }

  // Large file — send download link
  const url = downloadUrl ?? ""
  await resend.emails.send({
    from: FROM,
    to: recipients,
    subject: `[Query2Mail] ${jobName} — ${dateLabel} (Download Link)`,
    html: linkEmail(jobName, dateLabel, rowCount, url),
  })
  return "link"
}
