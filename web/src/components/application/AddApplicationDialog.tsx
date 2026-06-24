import { useState, type SyntheticEvent } from "react"
import { PlusIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/ui/form-field"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ApplicationStatus } from "@/types/applications"
import { applicationStatuses } from "@/lib/application-constants"
import {
  normalizeJobUrl,
  statusHasAppliedDate,
  statusHasInterviewDate,
} from "@/lib/application-utils"
import { useCreateApplicationMutation } from "@/queries/applications"

type AddApplicationDialogProps = {
  isOpen: boolean
  onClose: () => void
}

export function AddApplicationDialog({ isOpen, onClose }: AddApplicationDialogProps) {
  const createApplication = useCreateApplicationMutation()
  const [companyName, setCompanyName] = useState("")
  const [positionTitle, setPositionTitle] = useState("")
  const [status, setStatus] = useState<ApplicationStatus>("Interested")
  const [appliedDate, setAppliedDate] = useState("")
  const [interviewDate, setInterviewDate] = useState("")
  const [jobUrl, setJobUrl] = useState("")
  const [notes, setNotes] = useState("")
  const [submitError, setSubmitError] = useState<string | null>(null)
  const showAppliedDate = statusHasAppliedDate(status)
  const showInterviewDate = statusHasInterviewDate(status)

  function resetForm() {
    setCompanyName("")
    setPositionTitle("")
    setStatus("Interested")
    setAppliedDate("")
    setInterviewDate("")
    setJobUrl("")
    setNotes("")
    setSubmitError(null)
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault()

    try {
      setSubmitError(null)

      await createApplication.mutateAsync({
        companyName: companyName.trim(),
        positionTitle: positionTitle.trim(),
        status,
        appliedDate: showAppliedDate ? appliedDate || null : null,
        interviewDate: showInterviewDate ? interviewDate || null : null,
        jobUrl: normalizeJobUrl(jobUrl),
        notes: notes.trim() || null,
      })

      resetForm()
      onClose()
    } catch {
      setSubmitError("Could not add application.")
    }
  }

  function handleClose() {
    if (createApplication.isPending) return
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add application</DialogTitle>
          <DialogDescription>
            Add a role to your application list.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Company">
              <Input
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                required
                maxLength={150}
              />
            </FormField>

            <FormField label="Position">
              <Input
                value={positionTitle}
                onChange={(event) => setPositionTitle(event.target.value)}
                required
                maxLength={150}
              />
            </FormField>

            <FormField
              label="Status"
              className={showAppliedDate ? undefined : "sm:col-span-2"}
            >
              <Select
                value={status}
                onValueChange={(value) => {
                  const nextStatus = value as ApplicationStatus
                  setStatus(nextStatus)

                  if (!statusHasAppliedDate(nextStatus)) {
                    setAppliedDate("")
                  }

                  if (!statusHasInterviewDate(nextStatus)) {
                    setInterviewDate("")
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {applicationStatuses.map((applicationStatus) => (
                    <SelectItem key={applicationStatus} value={applicationStatus}>
                      {applicationStatus}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            {showAppliedDate && (
              <FormField label="Applied date (optional)">
                <Input
                  value={appliedDate}
                  onChange={(event) => setAppliedDate(event.target.value)}
                  type="date"
                />
              </FormField>
            )}

            {showInterviewDate && (
              <FormField label="Interview date and time (optional)">
                <Input
                  value={interviewDate}
                  onChange={(event) => setInterviewDate(event.target.value)}
                  type="datetime-local"
                />
              </FormField>
            )}
          </div>

          <FormField label="Job URL">
            <Input
              value={jobUrl}
              onChange={(event) => setJobUrl(event.target.value)}
              type="text"
              maxLength={2048}
            />
          </FormField>

          <FormField label="Notes">
            <Textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              maxLength={3000}
            />
          </FormField>

          {submitError && (
            <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {submitError}
            </p>
          )}

          <div className="flex flex-col-reverse gap-2 border-t border-zinc-200 pt-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createApplication.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createApplication.isPending}>
              <PlusIcon/>
              {createApplication.isPending ? "Adding..." : "Add application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
