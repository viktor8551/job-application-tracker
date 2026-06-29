import { ArrowLeftIcon } from "@phosphor-icons/react"
import { useEffect, useState } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { ApplicationHeader } from "@/components/application-detail/ApplicationHeader"
import { ApplicationInfoSection } from "@/components/application-detail/ApplicationInfoSection"
import { ApplicationNotesSection } from "@/components/application-detail/ApplicationNotesSection"
import { Button } from "@/components/ui/button"
import { StateMessage } from "@/components/ui/state-message"
import { useApplicationQuery } from "@/queries/applications"
import { ApplicationAttachmentsSection } from "@/components/application-detail/ApplicationAttachmentsSection"

export function ApplicationDetailPage() {
  const { applicationId } = useParams()
  const parsedApplicationId = Number(applicationId)

  if (!Number.isInteger(parsedApplicationId) || parsedApplicationId <= 0) {
    return <Navigate to="/applications" replace />
  }

  return <ApplicationDetailContent applicationId={parsedApplicationId} />
}

function ApplicationDetailContent({ applicationId }: { applicationId: number }) {
  const navigate = useNavigate()
  const applicationQuery = useApplicationQuery(applicationId)
  const [showSaveStatus, setShowSaveStatus] = useState(false)

  useEffect(() => {
    if (!showSaveStatus) return

    const timeoutId = window.setTimeout(() => {
      setShowSaveStatus(false)
    }, 2500)

    return () => window.clearTimeout(timeoutId)
  }, [showSaveStatus])

  return (
    <main className="min-h-screen bg-[#f7f7f4] px-4 py-5 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <Button type="button" variant="ghost" onClick={() => navigate("/applications")}>
          <ArrowLeftIcon />
          Back
        </Button>

        {applicationQuery.isPending && (
          <StateMessage variant="card" message="Loading application..." />
        )}
        
        {applicationQuery.isError && (
          <StateMessage variant="card" message="Could not load application." />
        )}

        {applicationQuery.data && (
          <div className="mt-4 space-y-5">
            <SaveStatus isVisible={showSaveStatus} />

            <ApplicationHeader
              application={applicationQuery.data}
            />

            <ApplicationInfoSection
              application={applicationQuery.data}
              onHideSaveStatus={() => setShowSaveStatus(false)}
              onSaved={() => setShowSaveStatus(true)}
            />

            <ApplicationNotesSection
              application={applicationQuery.data}
              onHideSaveStatus={() => setShowSaveStatus(false)}
              onSaved={() => setShowSaveStatus(true)}
            />

            <ApplicationAttachmentsSection
              applicationId={applicationQuery.data.id}
              attachments={applicationQuery.data.attachments}
            />
          </div>
        )}
      </div>
    </main>
  )
}

function SaveStatus({ isVisible }: { isVisible: boolean }) {
  if (!isVisible) return null

  return (
    <div className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
      Your application has been updated.
    </div>
  )
}
