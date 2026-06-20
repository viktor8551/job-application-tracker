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

export function normalizeJobUrl(url: string) {
  const trimmedUrl = url.trim()
  if (!trimmedUrl) return null

  if (/^https?:\/\//i.test(trimmedUrl))
    return trimmedUrl

  return `https://${trimmedUrl}`
}
