import { useState, type SyntheticEvent } from "react"
import { NotePencilIcon } from "@phosphor-icons/react"
import { FormField } from "@/components/ui/form-field"
import { FormActions } from "@/components/application-detail/FormActions"
import { SectionHeader } from "@/components/application-detail/SectionHeader"
import { Textarea } from "@/components/ui/textarea"
import { useUpdateApplicationMutation } from "@/queries/applications"
import type { JobApplication } from "@/types/applications"

type ApplicationDetailNotesSectionProps = {
  application: JobApplication
  onHideSaveStatus: () => void
  onSaved: () => void
}

export function ApplicationDetailNotesSection({
  application,
  onHideSaveStatus,
  onSaved,
}: ApplicationDetailNotesSectionProps) {
  const updateApplication = useUpdateApplicationMutation(application.id)
  const [isEditing, setIsEditing] = useState(false)
  const [notes, setNotes] = useState(application.notes ?? "")
  const [hasSubmitted, setHasSubmitted] = useState(false)

  function startEditing() {
    setNotes(application.notes ?? "")
    setHasSubmitted(false)
    updateApplication.reset()
    setIsEditing(true)
  }

  function cancelEditing() {
    setNotes(application.notes ?? "")
    setHasSubmitted(false)
    updateApplication.reset()
    onHideSaveStatus()
    setIsEditing(false)
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault()
    setHasSubmitted(true)

    try {
      await updateApplication.mutateAsync({
        companyName: application.companyName,
        positionTitle: application.positionTitle,
        status: application.status,
        appliedDate: application.appliedDate,
        interviewDate: application.interviewDate,
        jobUrl: application.jobUrl,
        notes: notes.trim() || null,
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
        title="Notes"
        icon={<NotePencilIcon className="size-5" />}
        isEditing={isEditing}
        onEdit={startEditing}
      />

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
          <FormField label="Notes">
            <Textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="min-h-72 leading-6"
              maxLength={3000}
              autoFocus
            />
          </FormField>

          <FormActions
            isSaving={updateApplication.isPending}
            errorMessage={
              hasSubmitted && updateApplication.isError
                ? "Could not save application."
                : null
            }
            onCancel={cancelEditing}
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
