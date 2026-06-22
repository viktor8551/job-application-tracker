import { MagnifyingGlassIcon } from "@phosphor-icons/react"
import { ApplicationList } from "@/components/applications/ApplicationList"
import { Input } from "@/components/ui/input"
import { filterStatuses } from "@/lib/application-constants"
import { cn } from "@/lib/utils"
import type { JobApplication } from "@/types/applications"

export function ApplicationTableSection({
  applications,
  activeStatus,
  searchQuery,
  isLoading,
  errorMessage,
  openActionMenuId,
  onStatusChange,
  onSearchChange,
  onOpenApplication,
  onActionMenuOpenChange,
  onRequestDelete,
}: {
  applications: JobApplication[]
  activeStatus: (typeof filterStatuses)[number]
  searchQuery: string
  isLoading: boolean
  errorMessage: string | null
  openActionMenuId: number | null
  onStatusChange: (status: (typeof filterStatuses)[number]) => void
  onSearchChange: (query: string) => void
  onOpenApplication: (applicationId: number) => void
  onActionMenuOpenChange: (applicationId: number, isOpen: boolean) => void
  onRequestDelete: (application: JobApplication) => void
}) {
  return (
    <section className="border border-zinc-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-zinc-200 p-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
          <Input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            className="pl-9"
            placeholder="Search company or role"
          />
        </div>

        <div className="flex flex-wrap gap-1">
          {filterStatuses.map((status) => (
            <button
              key={status}
              onClick={() => onStatusChange(status)}
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
          applications={applications}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onOpenApplication={onOpenApplication}
          openActionMenuId={openActionMenuId}
          onActionMenuOpenChange={onActionMenuOpenChange}
          onRequestDelete={onRequestDelete}
        />
      </div>
    </section>
  )
}
