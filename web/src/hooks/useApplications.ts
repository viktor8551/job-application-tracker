import { useEffect, useMemo, useState } from "react"
import { filterStatuses } from "@/lib/application-constants"
import { isDateInCurrentWeek } from "@/lib/application-utils"
import {
  createApplication,
  deleteApplication,
  getApplications,
} from "@/services/applications"
import type {
  CreateApplicationRequest,
  JobApplication,
} from "@/types/applications"

export function useApplications() {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [activeStatus, setActiveStatus] = useState<(typeof filterStatuses)[number]>("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [openActionMenuId, setOpenActionMenuId] = useState<number | null>(null)
  const [applicationToDelete, setApplicationToDelete] = useState<JobApplication | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    const abortController = new AbortController()

    async function loadApplications() {
      try {
        setIsLoading(true)
        setErrorMessage(null)
        setApplications(await getApplications(abortController.signal))
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return
        setErrorMessage("Could not load applications.")
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadApplications()

    return () => abortController.abort()
  }, [])

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const matchesStatus = activeStatus === "All" || application.status === activeStatus
      const matchesSearch = [
        application.companyName,
        application.positionTitle,
      ].join(" ").toLowerCase().includes(searchQuery.toLowerCase())

      return matchesStatus && matchesSearch
    })
  }, [activeStatus, applications, searchQuery])

  const metrics = useMemo(() => {
    const activeCount = applications.filter((application) =>
      ["Applied", "Interviewing", "Offered"].includes(application.status)
    ).length

    const interviewCount = applications.filter((application) =>
      application.status === "Interviewing"
    ).length
    
    const interviewsThisWeekCount = applications.filter((application) =>
        application.status === "Interviewing" &&
        isDateInCurrentWeek(application.interviewDate)
    ).length
    
    const appliedCount = applications.filter((application) =>
      application.status === "Applied"
    ).length

    return {
      activeCount,
      appliedCount,
      interviewCount,
      interviewsThisWeekCount,
      trackedCount: applications.length,
    }
  }, [applications])

  async function handleCreateApplication(request: CreateApplicationRequest) {
    const createdApplication = await createApplication(request)
    setApplications((currentApplications) => [
      createdApplication,
      ...currentApplications,
    ])
  }

  function handleActionMenuOpenChange(applicationId: number, isOpen: boolean) {
    setOpenActionMenuId(isOpen ? applicationId : null)
  }

  function handleRequestDelete(application: JobApplication) {
    setOpenActionMenuId(null)
    setDeleteError(null)
    setApplicationToDelete(application)
  }

  function handleCancelDelete() {
    if (isDeleting) return
    setApplicationToDelete(null)
    setDeleteError(null)
  }

  async function handleDeleteApplication() {
    if (!applicationToDelete) return

    try {
      setIsDeleting(true)
      setDeleteError(null)

      await deleteApplication(applicationToDelete.id)

      setApplications((currentApplications) =>
        currentApplications.filter(
          (application) => application.id !== applicationToDelete.id
        )
      )
      setApplicationToDelete(null)
    } catch {
      setDeleteError("Could not delete application.")
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    activeStatus,
    applicationToDelete,
    deleteError,
    filteredApplications,
    isDeleting,
    isLoading,
    metrics,
    openActionMenuId,
    searchQuery,
    errorMessage,
    handleCancelDelete,
    handleCreateApplication,
    handleDeleteApplication,
    handleRequestDelete,
    handleActionMenuOpenChange,
    setActiveStatus,
    setSearchQuery,
  }
}
