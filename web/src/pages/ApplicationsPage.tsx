import { useState } from "react"
import { AddApplicationDialog } from "@/components/application/AddApplicationDialog"
import { ApplicationsBrowser } from "@/components/applications-page/ApplicationsBrowser"
import { ApplicationsHeader } from "@/components/applications-page/ApplicationsHeader"
import { ApplicationMetrics } from "@/components/applications-page/ApplicationMetrics"

export function ApplicationsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  return (
    <>
      <ApplicationsHeader
        onAddApplication={() => setIsAddDialogOpen(true)}
      />

      <ApplicationMetrics/>

      <ApplicationsBrowser/>

      <AddApplicationDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
      />
    </>
  )
}
