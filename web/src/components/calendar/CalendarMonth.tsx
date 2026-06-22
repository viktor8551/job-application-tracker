import { Button } from "@/components/ui/button"
import { formatDateTime } from "@/lib/application-utils"
import type { JobApplication } from "@/types/applications"
import type { SelectedInterviewDay } from "@/types/calendar"
import {
  getInterviewTone,
  getInterviewsForDay,
  getMonthDays,
  isSameDate,
} from "@/lib/calendar-utils"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarBlankIcon,
} from "@phosphor-icons/react"

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export function CalendarMonth({
  visibleMonth,
  interviews,
  onPreviousMonth,
  onNextMonth,
  onSelectInterview,
  onSelectInterviewDay,
}: {
  visibleMonth: Date
  interviews: JobApplication[]
  onPreviousMonth: () => void
  onNextMonth: () => void
  onSelectInterview: (application: JobApplication) => void
  onSelectInterviewDay: (selectedDay: SelectedInterviewDay) => void
}) {
  const monthDays = getMonthDays(visibleMonth)
  const monthTitle = new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(visibleMonth)
  const today = new Date()

  return (
    <div>
      <div className="flex flex-col gap-3 border-b border-zinc-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-zinc-500">
          <CalendarBlankIcon className="size-5" />
          <h3 className="text-sm font-semibold uppercase text-zinc-700">
            {monthTitle}
          </h3>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onPreviousMonth}
          >
            <ArrowLeftIcon />
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onNextMonth}
          >
            Next
            <ArrowRightIcon />
          </Button>
        </div>
      </div>

      <div>
        <div className="grid grid-cols-7 border-b border-zinc-200 text-xs text-zinc-500">
          {weekDays.map((day) => (
            <div key={day} className="px-2 py-2 text-center">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {monthDays.map((day) => {
            const dayInterviews = getInterviewsForDay(interviews, day.date)
            const isToday = isSameDate(day.date, today)

            return (
              <div
                key={day.key}
                className={[
                  "min-h-24 border-r border-b p-2 nth-[7n]:border-r-0 sm:min-h-28",
                  isToday
                    ? "border-red-200 bg-red-50"
                    : "border-zinc-100 bg-white",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={[
                      "flex size-6 items-center justify-center text-xs",
                      day.isCurrentMonth ? "text-zinc-600" : "text-zinc-300",
                      isToday ? "font-semibold text-red-950" : "",
                    ].join(" ")}
                  >
                    {day.date.getDate()}
                  </span>
                  {isToday ? (
                    <span className="text-[11px] font-medium uppercase text-red-700">
                      Today
                    </span>
                  ) : null}
                </div>

                {day.isCurrentMonth ? (
                  <div className="mt-2 space-y-1">
                    {dayInterviews.slice(0, 2).map((application) => (
                      <button
                        key={application.id}
                        type="button"
                        onClick={() => onSelectInterview(application)}
                        title={`${formatDateTime(application.interviewDate)} - ${application.positionTitle} at ${application.companyName}`}
                        className={[
                          "block w-full cursor-pointer truncate border px-2 py-1 text-left text-xs transition-colors",
                          getInterviewTone(application, today),
                        ].join(" ")}
                      >
                        {application.companyName}
                      </button>
                    ))}
                    {dayInterviews.length > 2 ? (
                      <button
                        type="button"
                        onClick={() =>
                          onSelectInterviewDay({
                            date: day.date,
                            interviews: dayInterviews,
                          })
                        }
                        className="cursor-pointer text-xs font-medium text-zinc-600 underline-offset-2 hover:text-zinc-950 hover:underline"
                      >
                        +{dayInterviews.length - 2} more
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
