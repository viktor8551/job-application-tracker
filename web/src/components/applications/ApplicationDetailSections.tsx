import type { ReactNode, SyntheticEvent } from "react"
import { Field } from "@/components/applications/Field"
import { StatusBadge } from "@/components/applications/StatusBadge"
import { Button } from "@/components/ui/button"
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
import { formatDate, formatDateTime, normalizeJobUrl } from "@/lib/application-utils"
import type { ApplicationStatus, JobApplication } from "@/types/applications"
import {
  CalendarBlankIcon,
  LinkSimpleIcon,
  NotePencilIcon,
  PencilSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react"

type SubmitHandler = (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => void

export function ApplicationDetailHeader({
  application,
  onDelete,
}: {
  application: JobApplication
  onDelete: () => void
}) {
  return (
    <header className="border border-zinc-200 bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={application.status} />
            <span className="text-xs text-zinc-500">
              Created {formatDate(application.createdAt)}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
            {application.positionTitle}
          </h1>
          <p className="mt-2 text-base text-zinc-600">
            {application.companyName}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="destructive" onClick={onDelete}>
            <TrashIcon/>
            Delete
          </Button>
        </div>
      </div>
    </header>
  )
}

export function SaveStatus({ message }: { message: string | null }) {
  if (!message) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
    >
      {message} Your application has been updated.
    </div>
  )
}

export function ApplicationInfoSection({
  application,
  isEditing,
  isSaving,
  saveError,
  companyName,
  positionTitle,
  status,
  appliedDate,
  interviewDate,
  jobUrl,
  showAppliedDate,
  showInterviewDate,
  onCompanyNameChange,
  onPositionTitleChange,
  onStatusChange,
  onAppliedDateChange,
  onInterviewDateChange,
  onJobUrlChange,
  onEdit,
  onCancel,
  onSubmit,
}: {
  application: JobApplication
  isEditing: boolean
  isSaving: boolean
  saveError: string | null
  companyName: string
  positionTitle: string
  status: ApplicationStatus
  appliedDate: string
  interviewDate: string
  jobUrl: string
  showAppliedDate: boolean
  showInterviewDate: boolean
  onCompanyNameChange: (value: string) => void
  onPositionTitleChange: (value: string) => void
  onStatusChange: (status: ApplicationStatus) => void
  onAppliedDateChange: (value: string) => void
  onInterviewDateChange: (value: string) => void
  onJobUrlChange: (value: string) => void
  onEdit: () => void
  onCancel: () => void
  onSubmit: SubmitHandler
}) {
  return (
    <section className="border border-zinc-200 bg-white">
      <SectionHeader
        title="Application information"
        icon={<CalendarBlankIcon className="size-5" />}
        isEditing={isEditing}
        onEdit={onEdit}
      />

      {isEditing ? (
        <form onSubmit={onSubmit} className="space-y-5 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company">
              <Input
                value={companyName}
                onChange={(event) => onCompanyNameChange(event.target.value)}
                required
                maxLength={150}
                autoFocus
              />
            </Field>

            <Field label="Position">
              <Input
                value={positionTitle}
                onChange={(event) => onPositionTitleChange(event.target.value)}
                required
                maxLength={150}
              />
            </Field>

            <Field label="Status">
              <Select
                value={status}
                onValueChange={(value) =>
                  onStatusChange(value as ApplicationStatus)
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
            </Field>

            {showAppliedDate ? (
              <Field label="Applied date (optional)">
                <Input
                  value={appliedDate}
                  onChange={(event) => onAppliedDateChange(event.target.value)}
                  type="date"
                />
              </Field>
            ) : null}

            {showInterviewDate ? (
              <Field label="Interview date and time">
                <Input
                  value={interviewDate}
                  onChange={(event) => onInterviewDateChange(event.target.value)}
                  type="datetime-local"
                />
              </Field>
            ) : null}

            <Field
              label="Job URL"
              className={showInterviewDate ? undefined : "sm:col-span-2"}
            >
              <Input
                value={jobUrl}
                onChange={(event) => onJobUrlChange(event.target.value)}
                type="text"
                maxLength={2048}
              />
            </Field>
          </div>

          <FormActions
            isSaving={isSaving}
            errorMessage={saveError}
            onCancel={onCancel}
          />
        </form>
      ) : (
        <div className="grid border-t border-zinc-100 sm:grid-cols-2 lg:grid-cols-3">
          <ReadField label="Company" value={application.companyName} />
          <ReadField label="Position" value={application.positionTitle} />
          <ReadField label="Status" value={application.status} />
          <ReadField label="Applied" value={formatDate(application.appliedDate)} />
          {application.status === "Interviewing" ? (
            <ReadField
              label="Interview"
              value={formatDateTime(application.interviewDate)}
            />
          ) : null}
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

export function NotesSection({
  application,
  isEditing,
  isSaving,
  saveError,
  notes,
  onNotesChange,
  onEdit,
  onCancel,
  onSubmit,
}: {
  application: JobApplication
  isEditing: boolean
  isSaving: boolean
  saveError: string | null
  notes: string
  onNotesChange: (value: string) => void
  onEdit: () => void
  onCancel: () => void
  onSubmit: SubmitHandler
}) {
  return (
    <section className="border border-zinc-200 bg-white">
      <SectionHeader
        title="Notes"
        icon={<NotePencilIcon className="size-5" />}
        isEditing={isEditing}
        onEdit={onEdit}
      />

      {isEditing ? (
        <form onSubmit={onSubmit} className="space-y-5 p-5 sm:p-6">
          <Field label="Notes">
            <Textarea
              value={notes}
              onChange={(event) => onNotesChange(event.target.value)}
              className="min-h-72 leading-6"
              maxLength={3000}
              autoFocus
            />
          </Field>

          <FormActions
            isSaving={isSaving}
            errorMessage={saveError}
            onCancel={onCancel}
          />
        </form>
      ) : (
        <p className="min-h-52 whitespace-pre-wrap px-5 py-4 text-sm leading-7 text-zinc-800 sm:px-6">
          {application.notes || "No notes yet."}
        </p>
      )}
    </section>
  )
}

export function PageState({ children }: { children: ReactNode }) {
  return (
    <section className="mt-5 border border-zinc-200 bg-white p-6 text-sm text-zinc-500">
      {children}
    </section>
  )
}

function SectionHeader({
  title,
  icon,
  isEditing,
  onEdit,
}: {
  title: string
  icon: ReactNode
  isEditing: boolean
  onEdit: () => void
}) {
  return (
    <header className="flex min-h-12 items-center justify-between gap-3 px-5 py-3 sm:px-6">
      <div className="flex items-center gap-2 text-zinc-500">
        {icon}
        <h2 className="text-sm font-semibold uppercase text-zinc-700">
          {title}
        </h2>
      </div>
      {!isEditing ? (
        <Button type="button" variant="ghost" size="sm" onClick={onEdit}>
          <PencilSimpleIcon/>
          Edit
        </Button>
      ) : null}
    </header>
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

function FormActions({
  isSaving,
  errorMessage,
  onCancel,
}: {
  isSaving: boolean
  errorMessage: string | null
  onCancel: () => void
}) {
  return (
    <>
      {errorMessage ? (
        <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {errorMessage}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-2 border-t border-zinc-200 pt-4 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          disabled={isSaving}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </>
  )
}
