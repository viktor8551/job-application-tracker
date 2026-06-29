export type ApplicationStatus =
  | "Interested"
  | "Applied"
  | "Interviewing"
  | "Offered"
  | "Rejected"
  | "Withdrawn"

export type JobApplication = {
  id: number
  companyName: string
  positionTitle: string
  status: ApplicationStatus
  appliedDate: string | null
  interviewDate: string | null
  jobUrl: string | null
  notes: string | null
  createdAt: string
  attachments: ApplicationAttachment[]
}

export type ApplicationAttachment = {
  id: number
  originalFileName: string
  contentType: string
  sizeBytes: number
  uploadedAt: string
}

export type AttachmentPolicy = {
  maxFiles: number
  maxFileSizeBytes: number
  allowedExtensions: string[]
}

export type CreateApplicationRequest = {
  companyName: string
  positionTitle: string
  status: ApplicationStatus
  appliedDate: string | null
  interviewDate: string | null
  jobUrl: string | null
  notes: string | null
}

export type UpdateApplicationRequest = CreateApplicationRequest
