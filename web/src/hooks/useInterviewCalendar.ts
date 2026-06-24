import { useMemo, useState } from "react"
import { parseDate } from "@/lib/application-utils"
import { useApplicationsQuery } from "@/queries/applications"
import type { JobApplication } from "@/types/applications"

const EMPTY_APPLICATION_LIST: JobApplication[] = []

export function useInterviewCalendar() {
  const applicationsQuery = useApplicationsQuery()
  const applications = applicationsQuery.data ?? EMPTY_APPLICATION_LIST
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })

  const interviews = useMemo(() => {
    return applications
      .filter((application) => {
        const interviewDate = parseDate(application.interviewDate)
        return application.status === "Interviewing" && interviewDate !== null
      })
      .sort((firstApplication, secondApplication) => {
        const firstDate = parseDate(firstApplication.interviewDate)
        const secondDate = parseDate(secondApplication.interviewDate)
        return (firstDate?.getTime() ?? 0) - (secondDate?.getTime() ?? 0)
      })
  }, [applications])

  const visibleMonthInterviews = useMemo(() => {
    return interviews.filter((application) => {
      const interviewDate = parseDate(application.interviewDate)

      return (
        interviewDate !== null &&
        interviewDate.getFullYear() === visibleMonth.getFullYear() &&
        interviewDate.getMonth() === visibleMonth.getMonth()
      )
    })
  }, [interviews, visibleMonth])

  function showPreviousMonth() {
    setVisibleMonth((currentMonth) =>
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  function showNextMonth() {
    setVisibleMonth((currentMonth) =>
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  return {
    interviews,
    isLoading: applicationsQuery.isPending,
    errorMessage: applicationsQuery.isError ? "Could not load interviews." : null,
    visibleMonth,
    visibleMonthInterviews,
    showNextMonth,
    showPreviousMonth,
  }
}
