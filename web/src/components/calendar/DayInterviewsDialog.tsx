import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatDateTime } from "@/lib/application-utils"
import { isPastInterview } from "@/lib/calendar-utils"
import type { JobApplication } from "@/types/applications"
import type { SelectedInterviewDay } from "@/types/calendar"

type DayInterviewsDialogProps = {
  selectedDay: SelectedInterviewDay | null
  onClose: () => void
  onSelectInterview: (application: JobApplication) => void
}

export function DayInterviewsDialog({
  selectedDay,
  onClose,
  onSelectInterview,
}: DayInterviewsDialogProps) {
  const today = new Date()
  const dayLabel = selectedDay
    ? new Intl.DateTimeFormat("en", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(selectedDay.date)
    : ""

  return (
    <Dialog
      open={selectedDay !== null}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Interviews</DialogTitle>
          <DialogDescription>
            {dayLabel ? `All interviews on ${dayLabel}.` : ""}
          </DialogDescription>
        </DialogHeader>

        {selectedDay ? (
          <div className="divide-y divide-zinc-100">
            {selectedDay.interviews.map((application) => (
              <button
                key={application.id}
                type="button"
                onClick={() => onSelectInterview(application)}
                className={[
                  "block w-full cursor-pointer px-4 py-4 text-left transition-colors",
                  isPastInterview(application, today)
                    ? "hover:bg-orange-50"
                    : "hover:bg-zinc-100",
                ].join(" ")}
              >
                <p className="text-sm font-semibold text-zinc-950">
                  {application.positionTitle}
                </p>
                <div className="mt-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-zinc-500">
                    {application.companyName}
                  </p>
                  <span
                    className={[
                      "text-xs font-medium",
                      isPastInterview(application, today)
                        ? "text-orange-700"
                        : "text-zinc-500",
                    ].join(" ")}
                  >
                    {formatDateTime(application.interviewDate)}
                  </span>
                </div>
              </button>
            ))}

            <div className="flex justify-end border-t border-zinc-200 px-4 py-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
