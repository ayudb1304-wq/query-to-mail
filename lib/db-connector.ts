import { Client as PgClient } from "pg"
import mysql from "mysql2/promise"

type DbType = "postgres" | "mysql"

interface ConnectionParams {
  db_type: DbType
  host: string
  port: number
  database_name: string
  username: string
  password: string
}

const TIMEOUT_MS = 5000

/**
 * Tests a live database connection by opening a connection and running SELECT 1.
 * Throws on failure.
 */
export async function testConnection(params: ConnectionParams): Promise<void> {
  if (params.db_type === "postgres") {
    const client = new PgClient({
      host: params.host,
      port: params.port,
      database: params.database_name,
      user: params.username,
      password: params.password,
      connectionTimeoutMillis: TIMEOUT_MS,
      ssl: { rejectUnauthorized: false },
    })
    await client.connect()
    await client.query("SELECT 1")
    await client.end()
    return
  }

  if (params.db_type === "mysql") {
    const connection = await mysql.createConnection({
      host: params.host,
      port: params.port,
      database: params.database_name,
      user: params.username,
      password: params.password,
      connectTimeout: TIMEOUT_MS,
      ssl: { rejectUnauthorized: false },
    })
    await connection.query("SELECT 1")
    await connection.end()
    return
  }

  throw new Error(`Unsupported database type: ${params.db_type}`)
}
