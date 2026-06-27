import { useState, type ReactNode, type SyntheticEvent } from "react"
import { CalendarBlankIcon, LinkSimpleIcon } from "@phosphor-icons/react"
import { FormField } from "@/components/ui/form-field"
import { FormActions } from "@/components/application-detail/FormActions"
import { SectionHeader } from "@/components/application-detail/SectionHeader"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { applicationStatuses } from "@/lib/application-constants"
import {
  formatDate,
  formatDateTime,
  isValidJobUrl,
  normalizeJobUrl,
  statusHasAppliedDate,
  statusHasInterviewDate,
  toDateInputValue,
  toDateTimeInputValue,
} from "@/lib/application-utils"
import { useUpdateApplicationMutation } from "@/queries/applications"
import type {
  ApplicationStatus,
  JobApplication,
} from "@/types/applications"

type ApplicationDetailInfoSectionProps = {
  application: JobApplication
  onHideSaveStatus: () => void
  onSaved: () => void
}

export function ApplicationDetailInfoSection({
  application,
  onHideSaveStatus,
  onSaved,
}: ApplicationDetailInfoSectionProps) {
  const updateApplication = useUpdateApplicationMutation(application.id)
  const [isEditing, setIsEditing] = useState(false)
  const [companyName, setCompanyName] = useState(application.companyName)
  const [positionTitle, setPositionTitle] = useState(application.positionTitle)
  const [status, setStatus] = useState<ApplicationStatus>(application.status)
  const [appliedDate, setAppliedDate] = useState(toDateInputValue(application.appliedDate))
  const [interviewDate, setInterviewDate] = useState(toDateTimeInputValue(application.interviewDate))
  const [jobUrl, setJobUrl] = useState(application.jobUrl ?? "")
  const [formError, setFormError] = useState<string | null>(null)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const showAppliedDate = statusHasAppliedDate(status)
  const showInterviewDate = statusHasInterviewDate(status)

  function setFormFromApplication() {
    setCompanyName(application.companyName)
    setPositionTitle(application.positionTitle)
    setStatus(application.status)
    setAppliedDate(toDateInputValue(application.appliedDate))
    setInterviewDate(toDateTimeInputValue(application.interviewDate))
    setJobUrl(application.jobUrl ?? "")
  }

  function startEditing() {
    setFormFromApplication()
    setFormError(null)
    setHasSubmitted(false)
    updateApplication.reset()
    setIsEditing(true)
  }

  function cancelEditing() {
    setFormFromApplication()
    setFormError(null)
    setHasSubmitted(false)
    updateApplication.reset()
    onHideSaveStatus()
    setIsEditing(false)
  }

  function handleStatusChange(nextStatus: ApplicationStatus) {
    setStatus(nextStatus)

    if (!statusHasAppliedDate(nextStatus)) {
      setAppliedDate("")
    }

    if (!statusHasInterviewDate(nextStatus)) {
      setInterviewDate("")
    }
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault()

    if (!companyName.trim() || !positionTitle.trim()) {
      setFormError("Company and position are required.")
      return
    }

    if (!isValidJobUrl(jobUrl)) {
      setFormError("Enter a valid job URL, such as example.com/job.")
      return
    }

    setFormError(null)
    setHasSubmitted(true)

    try {
      await updateApplication.mutateAsync({
        companyName: companyName.trim(),
        positionTitle: positionTitle.trim(),
        status,
        appliedDate: showAppliedDate ? appliedDate || null : null,
        interviewDate: showInterviewDate ? interviewDate || null : null,
        jobUrl: normalizeJobUrl(jobUrl),
        notes: application.notes,
      })
      setHasSubmitted(false)
      setIsEditing(false)
      onSaved()
    } catch {
      // The form renders the mutation error state.
    }
  }

  return (
    <section className="border border-zinc-200 bg-white">
      <SectionHeader
        title="Application information"
        icon={<CalendarBlankIcon className="size-5" />}
        isEditing={isEditing}
        onEdit={startEditing}
      />

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Company">
              <Input
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                required
                maxLength={150}
                autoFocus
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

            <FormField label="Status">
              <Select
                value={status}
                onValueChange={(value) =>
                  handleStatusChange(value as ApplicationStatus)
                }
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
              <FormField label="Interview date and time">
                <Input
                  value={interviewDate}
                  onChange={(event) => setInterviewDate(event.target.value)}
                  type="datetime-local"
                />
              </FormField>
            )}

            <FormField
              label="Job URL"
              className={showInterviewDate ? undefined : "sm:col-span-2"}
            >
              <Input
                value={jobUrl}
                onChange={(event) => {
                  setJobUrl(event.target.value)
                  setFormError(null)
                }}
                type="text"
                maxLength={2048}
              />
            </FormField>
          </div>

          <FormActions
            isSaving={updateApplication.isPending}
            errorMessage={
              formError ??
              (hasSubmitted && updateApplication.isError
                ? "Could not save application."
                : null)
            }
            onCancel={cancelEditing}
          />
        </form>
      ) : (
        <div className="grid border-t border-zinc-100 sm:grid-cols-2 lg:grid-cols-3">
          <ReadField label="Company" value={application.companyName} />
          <ReadField label="Position" value={application.positionTitle} />
          <ReadField label="Status" value={application.status} />
          <ReadField label="Applied" value={formatDate(application.appliedDate)} />
          {application.status === "Interviewing" && (
            <ReadField
              label="Interview"
              value={formatDateTime(application.interviewDate)}
            />
          )}
          <ReadField
            label="Job post"
            value={
              application.jobUrl ? (
                <a
                  href={normalizeJobUrl(application.jobUrl) ?? undefined}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline"
                >
                  <LinkSimpleIcon className="size-4" />
                  Open link
                </a>
              ) : (
                "Not added"
              )
            }
          />
        </div>
      )}
    </section>
  )
}

function ReadField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="border-t border-zinc-100 px-5 py-4 sm:px-6">
      <p className="text-xs text-zinc-500">{label}</p>
      <div className="mt-1 wrap-break-word text-sm font-medium text-zinc-950">
        {value}
      </div>
    </div>
  )
}
