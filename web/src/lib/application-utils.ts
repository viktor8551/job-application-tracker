import type { ApplicationStatus } from "@/types/applications"

export function statusHasAppliedDate(status: ApplicationStatus) {
  return status !== "Interested"
}

export function statusHasInterviewDate(status: ApplicationStatus) {
  return status === "Interviewing"
}

export function formatDate(date: string | null) {
  const parsedDate = parseDate(date)

  if (!parsedDate) return "-"

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(parsedDate)
}

export function formatDateTime(date: string | null) {
  const parsedDate = parseDate(date)

  if (!parsedDate) return "-"

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(parsedDate)
}

export function parseDate(date: string | null) {
  if (!date) return null

  const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? new Date(`${date}T00:00:00`)
    : new Date(date)

  if (Number.isNaN(parsedDate.getTime()))
    return null

  return parsedDate
}

export function isDateInCurrentWeek(date: string | null) {
  const parsedDate = parseDate(date)

  if (!parsedDate) return false

  const today = new Date()
  const dayOfWeek = today.getDay()
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  const startOfWeek = new Date(today)
  startOfWeek.setHours(0, 0, 0, 0)
  startOfWeek.setDate(today.getDate() - daysSinceMonday)

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 7)

  return parsedDate >= startOfWeek && parsedDate < endOfWeek
}

export function toDateInputValue(date: string | null) {
  const parsedDate = parseDate(date)
  if (!parsedDate) return ""

  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date))
    return date

  return parsedDate.toISOString().slice(0, 10)
}

export function toDateTimeInputValue(date: string | null) {
  const parsedDate = parseDate(date)
  if (!parsedDate) return ""

  return [
    parsedDate.getFullYear(),
    padDatePart(parsedDate.getMonth() + 1),
    padDatePart(parsedDate.getDate()),
  ].join("-") + `T${padDatePart(parsedDate.getHours())}:${padDatePart(parsedDate.getMinutes())}`
}

function padDatePart(value: number) {
  return value.toString().padStart(2, "0")
}

export function normalizeJobUrl(url: string) {
  const trimmedUrl = url.trim()
  if (!trimmedUrl) return null

  if (/^https?:\/\//i.test(trimmedUrl))
    return trimmedUrl

  return `https://${trimmedUrl}`
}

export function isValidJobUrl(url: string) {
  const normalizedUrl = normalizeJobUrl(url)
  if (!normalizedUrl) return true

  try {
    const { hostname, protocol } = new URL(normalizedUrl)
    // Makes sure the URL has a complete domain
    const domainPattern = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,63}|xn--[a-z0-9](?:[a-z0-9-]{0,57}[a-z0-9])?)$/i
    return (protocol === "http:" || protocol === "https:") && hostname.length <= 253 && domainPattern.test(hostname)
  } catch {
    return false
  }
}
