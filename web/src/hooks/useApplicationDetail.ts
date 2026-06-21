import { useEffect, useState, type SyntheticEvent } from "react"
import {
  normalizeJobUrl,
  statusHasAppliedDate,
  statusHasInterviewDate,
  toDateInputValue,
  toDateTimeInputValue,
} from "@/lib/application-utils"
import {
  deleteApplication,
  getApplication,
  updateApplication,
} from "@/services/applications"
import type {
  ApplicationStatus,
  JobApplication,
  UpdateApplicationRequest,
} from "@/types/applications"

type EditingArea = "application" | "notes" | null

export function useApplicationDetail({
  applicationId,
  onDeleted,
}: {
  applicationId: number
  onDeleted: () => void
}) {
  const [application, setApplication] = useState<JobApplication | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [companyName, setCompanyName] = useState("")
  const [positionTitle, setPositionTitle] = useState("")
  const [status, setStatus] = useState<ApplicationStatus>("Interested")
  const [appliedDate, setAppliedDate] = useState("")
  const [interviewDate, setInterviewDate] = useState("")
  const [jobUrl, setJobUrl] = useState("")
  const [notes, setNotes] = useState("")
  const [editingArea, setEditingArea] = useState<EditingArea>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [applicationToDelete, setApplicationToDelete] = useState<JobApplication | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const showAppliedDate = statusHasAppliedDate(status)
  const showInterviewDate = statusHasInterviewDate(status)

  function setFormFromApplication(applicationToEdit: JobApplication) {
    setCompanyName(applicationToEdit.companyName)
    setPositionTitle(applicationToEdit.positionTitle)
    setStatus(applicationToEdit.status)
    setAppliedDate(toDateInputValue(applicationToEdit.appliedDate))
    setInterviewDate(toDateTimeInputValue(applicationToEdit.interviewDate))
    setJobUrl(applicationToEdit.jobUrl ?? "")
    setNotes(applicationToEdit.notes ?? "")
  }

  useEffect(() => {
    const abortController = new AbortController()

    async function loadApplication() {
      try {
        setIsLoading(true)
        setErrorMessage(null)

        const applicationResponse = await getApplication(
          applicationId,
          abortController.signal
        )
        setApplication(applicationResponse)
        setFormFromApplication(applicationResponse)
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return
        setErrorMessage("Could not load application.")
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadApplication()

    return () => abortController.abort()
  }, [applicationId])

  useEffect(() => {
    if (!saveMessage) return
    
    const timeoutId = window.setTimeout(() => {
      setSaveMessage(null)
    }, 2500)

    return () => window.clearTimeout(timeoutId)
  }, [saveMessage])

  function startEditing(area: EditingArea) {
    if (application) {
      setFormFromApplication(application)
    }

    setEditingArea(area)
    setSaveError(null)
  }

  function cancelEditing() {
    if (application) {
      setFormFromApplication(application)
    }

    setEditingArea(null)
    setSaveMessage(null)
    setSaveError(null)
  }

  function handleStatusChange(nextStatus: ApplicationStatus) {
    setStatus(nextStatus)

    if (!statusHasAppliedDate(nextStatus)) {
      setAppliedDate("")
    }

    if (!statusHasInterviewDate(nextStatus)) {
      setInterviewDate("")
    }
  }

  async function handleSaveApplication(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault()

    if (!companyName.trim() || !positionTitle.trim()) {
      setSaveMessage(null)
      setSaveError("Company and position are required.")
      return
    }

    try {
      setIsSaving(true)
      setSaveMessage(null)
      setSaveError(null)

      const request: UpdateApplicationRequest = {
        companyName: companyName.trim(),
        positionTitle: positionTitle.trim(),
        status,
        appliedDate: showAppliedDate ? appliedDate || null : null,
        interviewDate: showInterviewDate ? interviewDate || null : null,
        jobUrl: normalizeJobUrl(jobUrl),
        notes: notes.trim() || null,
      }

      const updatedApplication = await updateApplication(applicationId, request)
      setApplication(updatedApplication)
      setFormFromApplication(updatedApplication)
      setEditingArea(null)
      setSaveMessage("Saved.")
    } catch {
      setSaveError("Could not save application.")
    } finally {
      setIsSaving(false)
    }
  }

  function requestDelete() {
    if (!application) return
    setDeleteError(null)
    setApplicationToDelete(application)
  }

  function cancelDelete() {
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
      onDeleted()
    } catch {
      setDeleteError("Could not delete application.")
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    application,
    applicationToDelete,
    appliedDate,
    companyName,
    deleteError,
    editingArea,
    errorMessage,
    interviewDate,
    isDeleting,
    isLoading,
    isSaving,
    jobUrl,
    notes,
    positionTitle,
    saveError,
    saveMessage,
    showAppliedDate,
    showInterviewDate,
    status,
    cancelDelete,
    cancelEditing,
    handleDeleteApplication,
    handleSaveApplication,
    handleStatusChange,
    requestDelete,
    setAppliedDate,
    setCompanyName,
    setInterviewDate,
    setJobUrl,
    setNotes,
    setPositionTitle,
    startEditing,
  }
}
