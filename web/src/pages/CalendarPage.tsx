import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CalendarMonth } from "@/components/calendar/CalendarMonth"
import { DayInterviewsDialog } from "@/components/calendar/DayInterviewsDialog"
import { InterviewDetailsDialog } from "@/components/calendar/InterviewDetailsDialog"
import { useInterviewCalendar } from "@/hooks/useInterviewCalendar"
import type { SelectedInterviewDay } from "@/types/calendar"
import type { JobApplication } from "@/types/applications"

export function CalendarPage() {
  const navigate = useNavigate()
  const calendar = useInterviewCalendar()
  const [selectedInterview, setSelectedInterview] = useState<JobApplication | null>(null)
  const [selectedInterviewDay, setSelectedInterviewDay] = useState<SelectedInterviewDay | null>(null)

  return (
    <>
      <header className="border-b border-zinc-200 pb-5">
        <h2 className="mt-1 text-2xl font-semibold sm:text-3xl">Calendar</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Interview dates from your tracked applications.
        </p>
      </header>

      <section className="mt-5">
        <div className="border border-zinc-200 bg-white">
          {calendar.isLoading ? (
            <CalendarMessage message="Loading interviews..." />
          ) : null}

          {calendar.errorMessage ? (
            <CalendarMessage message={calendar.errorMessage} />
          ) : null}

          {!calendar.isLoading && !calendar.errorMessage ? (
            <CalendarMonth
              visibleMonth={calendar.visibleMonth}
              interviews={calendar.visibleMonthInterviews}
              onPreviousMonth={calendar.showPreviousMonth}
              onNextMonth={calendar.showNextMonth}
              onSelectInterview={setSelectedInterview}
              onSelectInterviewDay={setSelectedInterviewDay}
            />
          ) : null}
        </div>
      </section>

      <InterviewDetailsDialog
        application={selectedInterview}
        onClose={() => setSelectedInterview(null)}
        onOpenApplication={(applicationId) => {
          setSelectedInterview(null)
          navigate(`/applications/${applicationId}`)
        }}
      />

      <DayInterviewsDialog
        selectedDay={selectedInterviewDay}
        onClose={() => setSelectedInterviewDay(null)}
        onSelectInterview={(application) => {
          setSelectedInterviewDay(null)
          setSelectedInterview(application)
        }}
      />
    </>
  )
}

function CalendarMessage({ message }: { message: string }) {
  return <p className="px-4 py-8 text-center text-sm text-zinc-500">{message}</p>
}
