import { apiBaseUrl } from "@/lib/application-constants"
import type {
  ApplicationAttachment,
  AttachmentPolicy,
  CreateApplicationRequest,
  JobApplication,
  UpdateApplicationRequest,
} from "@/types/applications"

async function parseApplicationResponse(response: Response, errorMessage: string) {
  if (!response.ok) throw new Error(errorMessage)
  return (await response.json()) as JobApplication
}

export async function getApplications(signal?: AbortSignal) {
  const response = await fetch(`${apiBaseUrl}/api/applications`, { signal })
  if (!response.ok) throw new Error("Could not load applications.")
  return (await response.json()) as JobApplication[]
}

export async function getApplication(applicationId: number, signal?: AbortSignal) {
  const response = await fetch(`${apiBaseUrl}/api/applications/${applicationId}`, {
    signal,
  })

  return parseApplicationResponse(response, "Could not load application.")
}

export async function createApplication(request: CreateApplicationRequest) {
  const response = await fetch(`${apiBaseUrl}/api/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })

  return parseApplicationResponse(response, "Could not add application.")
}

export async function updateApplication(applicationId: number, request: UpdateApplicationRequest) {
  const response = await fetch(`${apiBaseUrl}/api/applications/${applicationId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })

  return parseApplicationResponse(response, "Could not save application.")
}

export async function deleteApplication(applicationId: number) {
  const response = await fetch(`${apiBaseUrl}/api/applications/${applicationId}`, {
    method: "DELETE",
  })

  if (!response.ok) throw new Error("Could not delete application.")
}

export async function getAttachmentPolicy(signal?: AbortSignal) {
  const response = await fetch(`${apiBaseUrl}/api/attachment-policy`, { signal })
  if (!response.ok) throw new Error("Could not load attachment settings.")
  return (await response.json()) as AttachmentPolicy
}

export async function uploadApplicationAttachment(applicationId: number, file: File) {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${apiBaseUrl}/api/applications/${applicationId}/attachments`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || "Could not upload file.")
  }

  return (await response.json()) as ApplicationAttachment
}

export async function deleteApplicationAttachment(applicationId: number, attachmentId: number) {
  const response = await fetch(`${apiBaseUrl}/api/applications/${applicationId}/attachments/${attachmentId}`, {
    method: "DELETE",
  })

  if (!response.ok) throw new Error("Could not delete file.")
}

export function getApplicationAttachmentDownloadUrl(applicationId: number, attachmentId: number) {
  return `${apiBaseUrl}/api/applications/${applicationId}/attachments/${attachmentId}/download`
}
