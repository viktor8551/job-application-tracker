import { useState } from "react"
import { AddApplicationDialog } from "@/components/applications/AddApplicationDialog"
import { DeleteApplicationDialog } from "@/components/applications/DeleteApplicationDialog"
import { ApplicationTableSection } from "@/components/dashboard/ApplicationTableSection"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { useApplications } from "@/hooks/useApplications"

export function DashboardPage({ onOpenApplication }: {
  onOpenApplication: (applicationId: number) => void
}) {
  const dashboard = useApplications()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-zinc-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col lg:flex-row">
        <DashboardSidebar />

        <section className="flex-1 px-4 py-5 sm:px-6 lg:px-8">
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
            onOpenApplication={onOpenApplication}
            onActionMenuOpenChange={dashboard.handleActionMenuOpenChange}
            onRequestDelete={dashboard.handleRequestDelete}
          />
        </section>
      </div>

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
    </main>
  )
}
