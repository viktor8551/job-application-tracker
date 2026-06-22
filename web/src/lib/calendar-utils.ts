import { parseDate } from "@/lib/application-utils"
import type { JobApplication } from "@/types/applications"

export function isSameDate(firstDate: Date, secondDate: Date) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  )
}

export function isPastInterview(application: JobApplication, today: Date) {
  const interviewDate = parseDate(application.interviewDate)
  if (interviewDate === null) return false

  const normalizedInterviewDate = new Date(interviewDate)
  normalizedInterviewDate.setHours(0, 0, 0, 0)

  const normalizedToday = new Date(today)
  normalizedToday.setHours(0, 0, 0, 0)

  return normalizedInterviewDate < normalizedToday
}

export function getInterviewTone(application: JobApplication, today: Date) {
  if (isPastInterview(application, today)) {
    return "border-orange-200 bg-orange-50 text-orange-950 hover:bg-orange-100"
  }
  return "border-emerald-200 bg-emerald-50 text-emerald-950 hover:bg-emerald-100"
}

export function getInterviewsForDay(
  applications: JobApplication[],
  date: Date
) {
  return applications.filter((application) => {
    const interviewDate = parseDate(application.interviewDate)

    return (
      interviewDate !== null &&
      interviewDate.getFullYear() === date.getFullYear() &&
      interviewDate.getMonth() === date.getMonth() &&
      interviewDate.getDate() === date.getDate()
    )
  })
}

export function getMonthDays(visibleMonth: Date) {
  const firstDayOfMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1)
  const mondayOffset = (firstDayOfMonth.getDay() + 6) % 7
  const startDate = new Date(firstDayOfMonth)
  startDate.setDate(firstDayOfMonth.getDate() - mondayOffset)

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + index)

    return {
      date,
      isCurrentMonth: date.getMonth() === visibleMonth.getMonth(),
      key: date.toISOString(),
    }
  })
}
