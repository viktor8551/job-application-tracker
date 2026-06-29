import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createApplication,
  deleteApplicationAttachment,
  deleteApplication,
  getAttachmentPolicy,
  getApplication,
  getApplications,
  updateApplication,
  uploadApplicationAttachment,
} from "@/services/applications"
import type {
  ApplicationAttachment,
  JobApplication,
  CreateApplicationRequest,
  UpdateApplicationRequest,
} from "@/types/applications"

export const applicationQueryKeys = {
  all: ["applications"] as const,
  attachmentPolicy: ["attachment-policy"] as const,
  byId: (applicationId: number) => [
    ...applicationQueryKeys.all, applicationId
  ] as const,
}

export function useApplicationsQuery() {
  return useQuery({
    queryKey: applicationQueryKeys.all,
    queryFn: ({ signal }) => getApplications(signal),
  })
}

export function useApplicationQuery(applicationId: number) {
  return useQuery({
    queryKey: applicationQueryKeys.byId(applicationId),
    queryFn: ({ signal }) => getApplication(applicationId, signal),
  })
}

export function useCreateApplicationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CreateApplicationRequest) =>
      createApplication(request),
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: applicationQueryKeys.all,
        })
      },
  })
}

export function useUpdateApplicationMutation(applicationId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: UpdateApplicationRequest) =>
      updateApplication(applicationId, request),
      onSuccess: async (updatedApplication: JobApplication) => {
        queryClient.setQueryData(
          applicationQueryKeys.byId(applicationId),
          updatedApplication
        )
        await queryClient.invalidateQueries({
          queryKey: applicationQueryKeys.all,
        })
      },
  })
}

export function useDeleteApplicationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (applicationId: number) => deleteApplication(applicationId),
    onSuccess: async (_, applicationId) => {
      queryClient.removeQueries({
        queryKey: applicationQueryKeys.byId(applicationId),
      })
      await queryClient.invalidateQueries({
        queryKey: applicationQueryKeys.all,
      })
    },
  })
}

export function useAttachmentPolicyQuery() {
  return useQuery({
    queryKey: applicationQueryKeys.attachmentPolicy,
    queryFn: ({ signal }) => getAttachmentPolicy(signal),
    staleTime: Infinity,
  })
}

export function useCreateAttachmentMutation(applicationId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) =>
      uploadApplicationAttachment(applicationId, file),
      onSuccess: async (attachment: ApplicationAttachment) => {
      queryClient.setQueryData<JobApplication>(
        applicationQueryKeys.byId(applicationId),
        (application) => updateAttachments(
          application,
          (attachments) => [attachment, ...attachments]
        )
      )
        await queryClient.invalidateQueries({
          queryKey: applicationQueryKeys.all,
          exact: true,
        })
      },
  })
}

export function useDeleteAttachmentMutation(applicationId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (attachmentId: number) =>
      deleteApplicationAttachment(applicationId, attachmentId),
      onSuccess: async (_, attachmentId) => {
      queryClient.setQueryData<JobApplication>(
        applicationQueryKeys.byId(applicationId),
        (application) => updateAttachments(
          application,
          (attachments) => attachments.filter(
            (attachment) => attachment.id !== attachmentId
          )
        )
      )
        await queryClient.invalidateQueries({
          queryKey: applicationQueryKeys.all,
          exact: true,
        })
      },
  })
}

function updateAttachments(
  application: JobApplication | undefined,
  update: (attachments: ApplicationAttachment[]) => ApplicationAttachment[]
) {
  if (!application) return application

  return {
    ...application,
    attachments: update(application.attachments),
  }
}
