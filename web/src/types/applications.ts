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

