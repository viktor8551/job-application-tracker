import { useMemo, useState } from "react"
import { MagnifyingGlassIcon } from "@phosphor-icons/react"
import { DeleteApplicationDialog } from "@/components/application/DeleteApplicationDialog"
import { ApplicationList } from "@/components/applications-page/ApplicationList"
import { Input } from "@/components/ui/input"
import { filterStatuses } from "@/lib/application-constants"
import { cn } from "@/lib/utils"
import { useApplicationsQuery, useDeleteApplicationMutation } from "@/queries/applications"
import type { JobApplication } from "@/types/applications"

const EMPTY_APPLICATION_LIST: JobApplication[] = []

export function ApplicationsBrowser() {
  const applicationsQuery = useApplicationsQuery()
  const deleteApplication = useDeleteApplicationMutation()
  const applications = applicationsQuery.data ?? EMPTY_APPLICATION_LIST
  const [activeStatus, setActiveStatus] = useState<(typeof filterStatuses)[number]>("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [applicationToDelete, setApplicationToDelete] = useState<JobApplication | null>(null)

  const filteredApplications = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLowerCase()

    return applications.filter((application) => {
      const matchesStatus = activeStatus === "All" || application.status === activeStatus
      const matchesSearch = [
        application.companyName,
        application.positionTitle,
      ].join(" ").toLowerCase().includes(normalizedSearchQuery)

      return matchesStatus && matchesSearch
    })
  }, [activeStatus, applications, searchQuery])

  function handleRequestDelete(application: JobApplication) {
    deleteApplication.reset()
    setApplicationToDelete(application)
  }

  function handleCancelDelete() {
    if (deleteApplication.isPending) return
    deleteApplication.reset()
    setApplicationToDelete(null)
  }

  async function handleDeleteApplication() {
    if (!applicationToDelete) return

    try {
      await deleteApplication.mutateAsync(applicationToDelete.id)
      setApplicationToDelete(null)
    } catch {
      // The dialog renders the mutation error state.
    }
  }

  return (
    <>
      <section className="border border-zinc-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-zinc-200 p-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="pl-9"
              placeholder="Search company or role"
            />
          </div>

          <div className="flex flex-wrap gap-1">
            {filterStatuses.map((status) => (
              <button
                key={status}
                onClick={() => setActiveStatus(status)}
                className={cn(
                  "h-8 cursor-pointer border px-3 text-xs transition-colors",
                  activeStatus === status
                    ? "border-zinc-950 bg-zinc-950 text-white"
                    : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="hidden grid-cols-[1.6fr_1fr_0.9fr_1fr_0.4fr] border-b border-zinc-200 px-4 py-2 text-xs text-zinc-500 md:grid">
            <span>Role</span>
            <span>Status</span>
            <span>Applied</span>
            <span>Created</span>
          </div>

          <ApplicationList
            applications={filteredApplications}
            isLoading={applicationsQuery.isPending}
            errorMessage={applicationsQuery.isError ? "Could not load applications." : null}
            onRequestDelete={handleRequestDelete}
          />
        </div>
      </section>

      <DeleteApplicationDialog
        application={applicationToDelete}
        errorMessage={deleteApplication.isError ? "Could not delete application." : null}
        isDeleting={deleteApplication.isPending}
        onCancel={handleCancelDelete}
        onConfirm={handleDeleteApplication}
      />
    </>
  )
}
