import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AddApplicationDialog } from "@/components/applications/AddApplicationDialog"
import { DeleteApplicationDialog } from "@/components/applications/DeleteApplicationDialog"
import { ApplicationTableSection } from "@/components/dashboard/ApplicationTableSection"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics"
import { useApplications } from "@/hooks/useApplications"

export function DashboardPage() {
  const navigate = useNavigate()
  const dashboard = useApplications()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  return (
    <>
      <DashboardHeader onAddApplication={() => setIsAddDialogOpen(true)} />

      <DashboardMetrics
        trackedCount={dashboard.metrics.trackedCount}
        activeCount={dashboard.metrics.activeCount}
        appliedCount={dashboard.metrics.appliedCount}
        interviewCount={dashboard.metrics.interviewCount}
        interviewsThisWeekCount={dashboard.metrics.interviewsThisWeekCount}
      />

      <ApplicationTableSection
        applications={dashboard.filteredApplications}
        activeStatus={dashboard.activeStatus}
        searchQuery={dashboard.searchQuery}
        isLoading={dashboard.isLoading}
        errorMessage={dashboard.errorMessage}
        openActionMenuId={dashboard.openActionMenuId}
        onStatusChange={dashboard.setActiveStatus}
        onSearchChange={dashboard.setSearchQuery}
        onOpenApplication={(applicationId) =>
          navigate(`/applications/${applicationId}`)
        }
        onActionMenuOpenChange={dashboard.handleActionMenuOpenChange}
        onRequestDelete={dashboard.handleRequestDelete}
      />

      <AddApplicationDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onCreate={dashboard.handleCreateApplication}
      />

      <DeleteApplicationDialog
        application={dashboard.applicationToDelete}
        errorMessage={dashboard.deleteError}
        isDeleting={dashboard.isDeleting}
        onCancel={dashboard.handleCancelDelete}
        onConfirm={dashboard.handleDeleteApplication}
      />
    </>
  )
}
