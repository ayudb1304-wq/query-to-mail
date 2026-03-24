import { Client as PgClient } from "pg"
import mysql from "mysql2/promise"
import { decrypt } from "@/lib/crypto"
import { buildExcelBuffer } from "@/lib/excel"
import { sendReport } from "@/lib/mailer"
import { computeNextRunAt } from "@/lib/cron-utils"
import { createServiceClient } from "@/lib/supabase/server"

const LARGE_FILE_THRESHOLD = 20 * 1024 * 1024 // 20MB

interface ConnectionRecord {
  db_type: "postgres" | "mysql"
  host: string
  port: number
  database_name: string
  username_enc: string
  password_enc: string
}

interface JobRecord {
  id: string
  user_id: string
  name: string
  sql_query: string
  cron_expression: string
  recipients: string[]
  connections: ConnectionRecord
}

async function runQuery(
  job: JobRecord,
): Promise<{ columns: string[]; rows: unknown[][] }> {
  const username = decrypt(job.connections.username_enc)
  const password = decrypt(job.connections.password_enc)
  const { db_type, host, port, database_name } = job.connections

  if (db_type === "postgres") {
    const client = new PgClient({
      host,
      port,
      database: database_name,
      user: username,
      password,
      connectionTimeoutMillis: 8000,
      ssl: { rejectUnauthorized: false },
    })
    await client.connect()
    try {
      await client.query("BEGIN READ ONLY")
      const result = await client.query(job.sql_query)
      await client.query("ROLLBACK")
      const columns = result.fields.map((f) => f.name)
      const rows = result.rows.map((row) => columns.map((col) => row[col]))
      return { columns, rows }
    } finally {
      await client.end()
    }
  }

  if (db_type === "mysql") {
    const connection = await mysql.createConnection({
      host,
      port,
      database: database_name,
      user: username,
      password,
      connectTimeout: 8000,
      ssl: { rejectUnauthorized: false },
    })
    try {
      await connection.query("SET SESSION TRANSACTION READ ONLY")
      await connection.beginTransaction()
      const [rows, fields] = await connection.execute(job.sql_query) as [
        Record<string, unknown>[],
        mysql.FieldPacket[],
      ]
      await connection.rollback()
      const columns = fields.map((f) => f.name)
      const dataRows = rows.map((row) => columns.map((col) => row[col]))
      return { columns, rows: dataRows }
    } finally {
      await connection.end()
    }
  }

  throw new Error(`Unsupported db_type: ${db_type}`)
}

export async function executeJob(jobId: string): Promise<void> {
  const supabase = createServiceClient()
  const now = new Date()
  const dateLabel = now.toISOString().slice(0, 10)

  // Fetch job with its connection
  const { data: job, error: jobError } = await supabase
    .from("query_jobs")
    .select(`
      id, user_id, name, sql_query, cron_expression, recipients,
      connections ( db_type, host, port, database_name, username_enc, password_enc )
    `)
    .eq("id", jobId)
    .single()

  if (jobError || !job) {
    throw new Error(`Job ${jobId} not found: ${jobError?.message ?? "no data"}`)
  }

  // Create running log entry
  const { data: logEntry } = await supabase
    .from("job_logs")
    .insert({ job_id: jobId, status: "running", executed_at: now.toISOString() })
    .select("id")
    .single()

  const logId = logEntry?.id

  try {
    const { columns, rows } = await runQuery(job as unknown as JobRecord)

    const buffer = await buildExcelBuffer({
      sheetName: job.name,
      columns,
      rows,
    })

    let downloadUrl: string | undefined

    if (buffer.length >= LARGE_FILE_THRESHOLD) {
      const path = `${job.user_id}/${jobId}/${now.getTime()}.xlsx`
      const { error: uploadError } = await supabase.storage
        .from("reports")
        .upload(path, buffer, {
          contentType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          upsert: false,
        })
      if (uploadError) throw new Error(`Storage upload failed: ${uploadError.message}`)

      const { data: signed } = await supabase.storage
        .from("reports")
        .createSignedUrl(path, 172800) // 48h
      downloadUrl = signed?.signedUrl
    }

    const deliveryMethod = await sendReport({
      jobName: job.name,
      recipients: job.recipients,
      buffer,
      rowCount: rows.length,
      dateLabel,
      downloadUrl,
    })

    // Update log to success
    if (logId) {
      await supabase
        .from("job_logs")
        .update({
          status: "success",
          rows_returned: rows.length,
          file_size_bytes: buffer.length,
          delivery_method: deliveryMethod,
        })
        .eq("id", logId)
    }

    // Advance job timestamps
    await supabase
      .from("query_jobs")
      .update({
        last_run_at: now.toISOString(),
        next_run_at: computeNextRunAt(job.cron_expression).toISOString(),
      })
      .eq("id", jobId)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    if (logId) {
      await supabase
        .from("job_logs")
        .update({ status: "failed", error_message: message })
        .eq("id", logId)
    }
    throw err
  }
}
