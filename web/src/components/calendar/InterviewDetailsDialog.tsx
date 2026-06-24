import { ArrowSquareOutIcon } from "@phosphor-icons/react"
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

type InterviewDetailsDialogProps = {
  application: JobApplication | null
  onClose: () => void
  onOpenApplication: (applicationId: number) => void
}

export function InterviewDetailsDialog({
  application,
  onClose,
  onOpenApplication,
}: InterviewDetailsDialogProps) {
  const isPast = application ? isPastInterview(application, new Date()) : false

  return (
    <Dialog
      open={application !== null}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Interview</DialogTitle>
          <DialogDescription>
            Review this interview before opening the application.
          </DialogDescription>
        </DialogHeader>

        {application && (
          <div>
            <div className="px-4 py-5">
              <p className="text-xs font-medium uppercase text-zinc-500">
                {application.companyName}
              </p>
              <p className="mt-2 text-xl font-semibold leading-snug">
                {application.positionTitle}
              </p>
            </div>

            <div
              className={[
                "mx-4 border px-3 py-3",
                isPast
                  ? "border-orange-200 bg-orange-50"
                  : "border-zinc-200 bg-zinc-50",
              ].join(" ")}
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-zinc-600">
                  Interview date
                </p>
                <div className="flex flex-col gap-1 sm:items-end">
                  <p className="text-sm font-semibold text-zinc-950">
                    {formatDateTime(application.interviewDate)}
                  </p>
                  {isPast && (
                    <p className="text-xs font-medium text-orange-700">
                      Past interview
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2 border-t border-zinc-200 px-4 py-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button
                type="button"
                onClick={() => onOpenApplication(application.id)}
              >
                <ArrowSquareOutIcon/>
                Open application
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
