import { useState, type SyntheticEvent } from "react"
import { PlusIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { applicationStatuses } from "@/lib/application-constants"
import { normalizeJobUrl, statusHasAppliedDate } from "@/lib/application-utils"
import type { ApplicationStatus, CreateApplicationRequest } from "@/types/applications"
import { Field } from "./Field"

export function AddApplicationDialog({
  isOpen,
  onClose,
  onCreate,
}: {
  isOpen: boolean
  onClose: () => void
  onCreate: (request: CreateApplicationRequest) => Promise<void>
}) {
  const [companyName, setCompanyName] = useState("")
  const [positionTitle, setPositionTitle] = useState("")
  const [status, setStatus] = useState<ApplicationStatus>("Interested")
  const [appliedDate, setAppliedDate] = useState("")
  const [jobUrl, setJobUrl] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const showAppliedDate = statusHasAppliedDate(status)

  function resetForm() {
    setCompanyName("")
    setPositionTitle("")
    setStatus("Interested")
    setAppliedDate("")
    setJobUrl("")
    setNotes("")
    setSubmitError(null)
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault()

    try {
      setIsSubmitting(true)
      setSubmitError(null)

      await onCreate({
        companyName: companyName.trim(),
        positionTitle: positionTitle.trim(),
        status,
        appliedDate: showAppliedDate ? appliedDate || null : null,
        interviewDate: null,
        jobUrl: normalizeJobUrl(jobUrl),
        notes: notes.trim() || null,
      })

      resetForm()
      onClose()
    } catch {
      setSubmitError("Could not add application.")
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleClose() {
    if (isSubmitting) return
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
            <Field label="Company">
              <Input
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                required
                maxLength={150}
              />
            </Field>

            <Field label="Position">
              <Input
                value={positionTitle}
                onChange={(event) => setPositionTitle(event.target.value)}
                required
                maxLength={150}
              />
            </Field>

            <Field
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
            </Field>

            {showAppliedDate ? (
              <Field label="Applied date (optional)">
                <Input
                  value={appliedDate}
                  onChange={(event) => setAppliedDate(event.target.value)}
                  type="date"
                />
              </Field>
            ) : null}
          </div>

          <Field label="Job URL">
            <Input
              value={jobUrl}
              onChange={(event) => setJobUrl(event.target.value)}
              type="text"
              maxLength={2048}
            />
          </Field>

          <Field label="Notes">
            <Textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              maxLength={3000}
            />
          </Field>

          {submitError ? (
            <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {submitError}
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-2 border-t border-zinc-200 pt-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <PlusIcon/>
              {isSubmitting ? "Adding..." : "Add application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
