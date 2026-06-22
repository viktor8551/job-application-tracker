import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AddApplicationDialog } from "@/components/applications/AddApplicationDialog"
import { ApplicationsHeader } from "@/components/applications/ApplicationsHeader"
import { ApplicationMetrics } from "@/components/applications/ApplicationMetrics"
import { ApplicationTableSection } from "@/components/applications/ApplicationTableSection"
import { DeleteApplicationDialog } from "@/components/applications/DeleteApplicationDialog"
import { useApplications } from "@/hooks/useApplications"

export function ApplicationsPage() {
  const navigate = useNavigate()
  const applications = useApplications()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  return (
    <>
      <ApplicationsHeader onAddApplication={() => setIsAddDialogOpen(true)} />

      <ApplicationMetrics
        trackedCount={applications.metrics.trackedCount}
        activeCount={applications.metrics.activeCount}
        appliedCount={applications.metrics.appliedCount}
        interviewCount={applications.metrics.interviewCount}
        interviewsThisWeekCount={applications.metrics.interviewsThisWeekCount}
      />

      <ApplicationTableSection
        applications={applications.filteredApplications}
        activeStatus={applications.activeStatus}
        searchQuery={applications.searchQuery}
        isLoading={applications.isLoading}
        errorMessage={applications.errorMessage}
        openActionMenuId={applications.openActionMenuId}
        onStatusChange={applications.setActiveStatus}
        onSearchChange={applications.setSearchQuery}
        onOpenApplication={(applicationId) =>
          navigate(`/applications/${applicationId}`)
        }
        onActionMenuOpenChange={applications.handleActionMenuOpenChange}
        onRequestDelete={applications.handleRequestDelete}
      />

      <AddApplicationDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onCreate={applications.handleCreateApplication}
      />

      <DeleteApplicationDialog
        application={applications.applicationToDelete}
        errorMessage={applications.deleteError}
        isDeleting={applications.isDeleting}
        onCancel={applications.handleCancelDelete}
        onConfirm={applications.handleDeleteApplication}
      />
    </>
  )
}
