import { ApplicationActionsMenu } from "@/components/applications/ApplicationActionsMenu"
import { StatusBadge } from "@/components/applications/StatusBadge"
import { formatDate } from "@/lib/application-utils"
import type { JobApplication } from "@/types/applications"

function ApplicationMessage({ message }: { message: string }) {
  return <div className="px-4 py-8 text-center text-sm text-zinc-500">{message}</div>
}

export function ApplicationList({
  applications,
  isLoading,
  errorMessage,
  onOpenApplication,
  openActionMenuId,
  onActionMenuOpenChange,
  onRequestDelete,
}: {
  applications: JobApplication[]
  isLoading: boolean
  errorMessage: string | null
  onOpenApplication: (applicationId: number) => void
  openActionMenuId: number | null
  onActionMenuOpenChange: (applicationId: number, isOpen: boolean) => void
  onRequestDelete: (application: JobApplication) => void
}) {
  if (isLoading) {
    return <ApplicationMessage message="Loading applications..." />
  }

  if (errorMessage) {
    return <ApplicationMessage message={errorMessage} />
  }

  if (applications.length === 0) {
    return <ApplicationMessage message="No applications found." />
  }

  return (
    <div className="divide-y divide-zinc-200 md:divide-y-0">
      {applications.map((application) => (
        <ApplicationRow
          key={application.id}
          application={application}
          onOpenApplication={() => onOpenApplication(application.id)}
          isActionMenuOpen={openActionMenuId === application.id}
          onActionMenuOpenChange={(isOpen) =>
            onActionMenuOpenChange(application.id, isOpen)
          }
          onRequestDelete={() => onRequestDelete(application)}
        />
      ))}
    </div>
  )
}

function ApplicationRow({
  application,
  onOpenApplication,
  isActionMenuOpen,
  onActionMenuOpenChange,
  onRequestDelete,
}: {
  application: JobApplication
  onOpenApplication: () => void
  isActionMenuOpen: boolean
  onActionMenuOpenChange: (isOpen: boolean) => void
  onRequestDelete: () => void
}) {
  return (
    <div className="relative p-4 md:grid md:grid-cols-[1.6fr_1fr_0.9fr_1fr_0.4fr] md:items-center md:border-b md:border-zinc-100 md:px-4 md:py-3 md:last:border-b-0">
      <div className="min-w-0 pr-10 md:pr-0">
        <div className="min-w-0">
          <button
            type="button"
            onClick={onOpenApplication}
            className="block max-w-full cursor-pointer text-left text-sm font-medium underline-offset-4 hover:underline md:truncate"
          >
            {application.positionTitle}
          </button>
          <p className="mt-1 text-xs text-zinc-500 md:truncate">
            {application.companyName}
          </p>
        </div>
      </div>

      <div className="mt-3 md:mt-0">
        <StatusBadge status={application.status} />
      </div>

      <ApplicationDate label="Applied" value={application.appliedDate} />
      <ApplicationDate label="Created" value={application.createdAt} />

      <div className="absolute top-4 right-4 md:static md:block">
        <ApplicationActionsMenu
          isOpen={isActionMenuOpen}
          onOpenChange={onActionMenuOpenChange}
          onOpen={onOpenApplication}
          onDelete={onRequestDelete}
        />
      </div>
    </div>
  )
}

function ApplicationDate({
  label,
  value,
}: {
  label: string
  value: string | null
}) {
  return (
    <div className="mt-4 inline-block w-1/2 pr-3 text-xs md:mt-0 md:block md:w-auto md:pr-0 md:text-sm md:text-zinc-600">
      <p className="text-zinc-500 md:hidden">{label}</p>
      <p className="mt-1 text-zinc-900 md:mt-0 md:text-zinc-600">
        {formatDate(value)}
      </p>
    </div>
  )
}
