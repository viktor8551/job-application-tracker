import { useState } from "react"
import { TrashIcon } from "@phosphor-icons/react"
import { useNavigate } from "react-router-dom"
import { DeleteApplicationDialog } from "@/components/application/DeleteApplicationDialog"
import { StatusBadge } from "@/components/application/StatusBadge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/application-utils"
import { useDeleteApplicationMutation } from "@/queries/applications"
import type { JobApplication } from "@/types/applications"

type ApplicationDetailHeaderProps = {
  application: JobApplication
}

export function ApplicationDetailHeader({ application }: ApplicationDetailHeaderProps) {
  const navigate = useNavigate()
  const deleteApplication = useDeleteApplicationMutation()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  function requestDelete() {
    deleteApplication.reset()
    setIsDeleteDialogOpen(true)
  }

  function cancelDelete() {
    if (deleteApplication.isPending) return
    deleteApplication.reset()
    setIsDeleteDialogOpen(false)
  }

  async function confirmDelete() {
    try {
      await deleteApplication.mutateAsync(application.id)
      navigate("/dashboard")
    } catch {
      // The dialog renders the mutation error state
    }
  }

  return (
    <>
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
            <Button type="button" variant="destructive" onClick={requestDelete}>
              <TrashIcon />
              Delete
            </Button>
          </div>
        </div>
      </header>

      <DeleteApplicationDialog
        application={isDeleteDialogOpen ? application : null}
        errorMessage={deleteApplication.isError ? "Could not delete application." : null}
        isDeleting={deleteApplication.isPending}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />
    </>
  )
}
