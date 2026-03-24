import { CronExpressionParser } from "cron-parser"

export type Frequency = "daily" | "weekly" | "monthly"

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const DAY_ABBR  = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function pad(n: number) {
  return n.toString().padStart(2, "0")
}

function formatTime(hour: number, minute: number) {
  const suffix = hour >= 12 ? "PM" : "AM"
  const h = hour % 12 === 0 ? 12 : hour % 12
  return `${h}:${pad(minute)} ${suffix}`
}

export function buildCronExpression(
  frequency: Frequency,
  hour: number,
  minute: number,
  dayOfWeek?: number,  // 0 = Sunday … 6 = Saturday
  dayOfMonth?: number, // 1–28
): string {
  const m = minute.toString()
  const h = hour.toString()
  if (frequency === "daily")   return `${m} ${h} * * *`
  if (frequency === "weekly")  return `${m} ${h} * * ${dayOfWeek ?? 1}`
  if (frequency === "monthly") return `${m} ${h} ${dayOfMonth ?? 1} * *`
  throw new Error(`Unknown frequency: ${frequency}`)
}

export function cronToDescription(cron: string): string {
  const parts = cron.trim().split(/\s+/)
  if (parts.length !== 5) return cron

  const [minute, hour, dom, , dow] = parts
  const h = parseInt(hour)
  const m = parseInt(minute)
  const time = formatTime(h, m)

  if (dow !== "*") {
    const dayName = DAY_NAMES[parseInt(dow)] ?? dow
    return `Weekly on ${dayName} at ${time}`
  }
  if (dom !== "*") {
    const suffix = parseInt(dom) === 1 ? "st" : parseInt(dom) === 2 ? "nd" : parseInt(dom) === 3 ? "rd" : "th"
    return `Monthly on the ${dom}${suffix} at ${time}`
  }
  return `Daily at ${time}`
}

export function computeNextRunAt(cron: string): Date {
  const interval = CronExpressionParser.parse(cron, { tz: "UTC" })
  return interval.next().toDate()
}

export { DAY_NAMES, DAY_ABBR }
