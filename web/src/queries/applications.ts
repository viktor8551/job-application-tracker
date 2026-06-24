import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createApplication,
  deleteApplication,
  getApplication,
  getApplications,
  updateApplication,
} from "@/services/applications"
import type {
  CreateApplicationRequest,
  JobApplication,
  UpdateApplicationRequest,
} from "@/types/applications"

export const applicationQueryKeys = {
  all: ["applications"] as const,
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
