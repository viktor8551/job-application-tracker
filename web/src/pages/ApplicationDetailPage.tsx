import { ArrowLeftIcon } from "@phosphor-icons/react"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { DeleteApplicationDialog } from "@/components/applications/DeleteApplicationDialog"
import { Button } from "@/components/ui/button"
import { useApplicationDetail } from "@/hooks/useApplicationDetail"
import {
  ApplicationDetailHeader,
  ApplicationInfoSection,
  NotesSection,
  PageState,
  SaveStatus,
} from "@/components/applications/ApplicationDetailSections"

export function ApplicationDetailPage() {
  const { applicationId } = useParams()
  const parsedApplicationId = Number(applicationId)

  if (!Number.isInteger(parsedApplicationId) || parsedApplicationId <= 0) {
    return <Navigate to="/dashboard" replace />
  }

  return <ApplicationDetailContent applicationId={parsedApplicationId} />
}

function ApplicationDetailContent({ applicationId }: { applicationId: number }) {
  const navigate = useNavigate()

  function navigateBack() {
    navigate("/dashboard")
  }

  const detail = useApplicationDetail({
    applicationId,
    onDeleted: navigateBack,
  })

  return (
    <main className="min-h-screen bg-[#f7f7f4] px-4 py-5 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <Button type="button" variant="ghost" onClick={navigateBack}>
          <ArrowLeftIcon />
          Back
        </Button>

        {detail.isLoading ? <PageState>Loading application...</PageState> : null}
        
        {detail.errorMessage ? (
          <PageState>{detail.errorMessage}</PageState>
        ) : null}

        {detail.application ? (
          <div className="mt-4 space-y-5">
            <SaveStatus message={detail.saveMessage} />

            <ApplicationDetailHeader
              application={detail.application}
              onDelete={detail.requestDelete}
            />

            <ApplicationInfoSection
              application={detail.application}
              isEditing={detail.editingArea === "application"}
              isSaving={detail.isSaving}
              saveError={
                detail.editingArea === "application" ? detail.saveError : null
              }
              companyName={detail.companyName}
              positionTitle={detail.positionTitle}
              status={detail.status}
              appliedDate={detail.appliedDate}
              interviewDate={detail.interviewDate}
              jobUrl={detail.jobUrl}
              showAppliedDate={detail.showAppliedDate}
              showInterviewDate={detail.showInterviewDate}
              onCompanyNameChange={detail.setCompanyName}
              onPositionTitleChange={detail.setPositionTitle}
              onStatusChange={detail.handleStatusChange}
              onAppliedDateChange={detail.setAppliedDate}
              onInterviewDateChange={detail.setInterviewDate}
              onJobUrlChange={detail.setJobUrl}
              onEdit={() => detail.startEditing("application")}
              onCancel={detail.cancelEditing}
              onSubmit={detail.handleSaveApplication}
            />

            <NotesSection
              application={detail.application}
              isEditing={detail.editingArea === "notes"}
              isSaving={detail.isSaving}
              saveError={detail.editingArea === "notes" ? detail.saveError : null}
              notes={detail.notes}
              onNotesChange={detail.setNotes}
              onEdit={() => detail.startEditing("notes")}
              onCancel={detail.cancelEditing}
              onSubmit={detail.handleSaveApplication}
            />
          </div>
        ) : null}

        <DeleteApplicationDialog
          application={detail.applicationToDelete}
          errorMessage={detail.deleteError}
          isDeleting={detail.isDeleting}
          onCancel={detail.cancelDelete}
          onConfirm={detail.handleDeleteApplication}
        />
      </div>
    </main>
  )
}
