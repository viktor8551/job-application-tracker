import { useEffect, useMemo, useState } from "react"
import { parseDate } from "@/lib/application-utils"
import { getApplications } from "@/services/applications"
import type { JobApplication } from "@/types/applications"

export function useInterviewCalendar() {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const abortController = new AbortController()

    async function loadApplications() {
      try {
        setIsLoading(true)
        setErrorMessage(null)
        setApplications(await getApplications(abortController.signal))
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return
        setErrorMessage("Could not load interviews.")
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadApplications()

    return () => abortController.abort()
  }, [])

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
    setVisibleMonth((currentMonth) => new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  function showNextMonth() {
    setVisibleMonth((currentMonth) => new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  return {
    errorMessage,
    interviews,
    isLoading,
    visibleMonth,
    visibleMonthInterviews,
    showNextMonth,
    showPreviousMonth,
  }
}
