import { useRef, useState, type ChangeEvent } from "react"
import {
  DownloadSimpleIcon,
  FileTextIcon,
  PaperclipIcon,
  TrashIcon,
  UploadSimpleIcon,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  useAttachmentPolicyQuery,
  useCreateAttachmentMutation,
  useDeleteAttachmentMutation,
} from "@/queries/applications"
import { getApplicationAttachmentDownloadUrl } from "@/services/applications"
import type { ApplicationAttachment } from "@/types/applications"

type ApplicationAttachmentsSectionProps = {
  applicationId: number
  attachments: ApplicationAttachment[]
}

export function ApplicationAttachmentsSection({
  applicationId,
  attachments,
}: ApplicationAttachmentsSectionProps) {
  const policyQuery = useAttachmentPolicyQuery()
  const policy = policyQuery.data
  const createAttachment = useCreateAttachmentMutation(applicationId)
  const deleteAttachment = useDeleteAttachmentMutation(applicationId)
  const [attachmentToDelete, setAttachmentToDelete] = useState<ApplicationAttachment | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const canUpload = Boolean(policy && attachments.length < policy.maxFiles && !createAttachment.isPending)

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? [])
    event.target.value = ""

    if (selectedFiles.length === 0) return

    if (!policy) {
      setErrorMessage("Attachment settings are not available yet.")
      return
    }

    const remainingSlots = policy.maxFiles - attachments.length

    if (selectedFiles.length > remainingSlots) {
      setErrorMessage(`You can upload ${remainingSlots} more file${remainingSlots === 1 ? "" : "s"}.`)
      return
    }

    const invalidFile = selectedFiles.find(
      (file) => !isAllowedFile(file, policy.allowedExtensions)
    )

    if (invalidFile) {
      setErrorMessage(`${invalidFile.name} is not a supported file type.`)
      return
    }

    const oversizedFile = selectedFiles.find(
      (file) => file.size > policy.maxFileSizeBytes
    )

    if (oversizedFile) {
      setErrorMessage(`${oversizedFile.name} is larger than ${formatFileSize(policy.maxFileSizeBytes)}.`)
      return
    }

    try {
      setErrorMessage(null)

      for (const file of selectedFiles) {
        await createAttachment.mutateAsync(file)
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not upload file."
      )
    }
  }

  function requestDelete(attachment: ApplicationAttachment) {
    setDeleteErrorMessage(null)
    setAttachmentToDelete(attachment)
  }

  function cancelDelete() {
    if (deleteAttachment.isPending) return
    setAttachmentToDelete(null)
    setDeleteErrorMessage(null)
  }

  async function handleDelete() {
    if (!attachmentToDelete) return

    try {
      setDeleteErrorMessage(null)
      await deleteAttachment.mutateAsync(attachmentToDelete.id)
      setAttachmentToDelete(null)
    } catch {
      setDeleteErrorMessage("Could not delete file.")
    }
  }

  return (
    <section className="border border-zinc-200 bg-white">
      <header className="flex min-h-12 flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2 text-zinc-500">
          <PaperclipIcon className="size-5" />
          <h2 className="text-sm font-semibold uppercase text-zinc-700">
            Attachments
          </h2>
          <span className="text-xs text-zinc-500">
            {attachments.length}/{policy?.maxFiles ?? "—"}
          </span>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={policy?.allowedExtensions.join(",")}
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            size="sm"
            disabled={!canUpload}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadSimpleIcon />
            {createAttachment.isPending ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </header>

      <div className="border-t border-zinc-100 px-5 py-4 sm:px-6">
        {errorMessage && (
          <p className="mb-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {errorMessage}
          </p>
        )}

        {policyQuery.isError && !errorMessage && (
          <p className="mb-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            Could not load attachment settings.
          </p>
        )}

        {attachments.length > 0 ? (
          <ul className="divide-y divide-zinc-100 border border-zinc-100">
            {attachments.map((attachment) => (
              <li
                key={attachment.id}
                className="flex flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <span className="flex min-w-0 items-center gap-2">
                    <FileTextIcon className="size-4 shrink-0 text-zinc-500" />
                    <span className="truncate text-sm font-medium text-zinc-950">
                      {attachment.originalFileName}
                    </span>
                  </span>
                  <span className="mt-1 block text-xs text-zinc-500">
                    {formatFileSize(attachment.sizeBytes)} - Uploaded{" "}
                    {formatAttachmentDate(attachment.uploadedAt)}
                  </span>
                </div>

                <div className="flex shrink-0 gap-2">
                  <Button type="button" variant="outline" size="sm" asChild>
                    <a
                      href={getApplicationAttachmentDownloadUrl(
                        applicationId,
                        attachment.id
                      )}
                    >
                      <DownloadSimpleIcon />
                      Download
                    </a>
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => requestDelete(attachment)}
                  >
                    <TrashIcon />
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-500">No files attached yet.</p>
        )}

        {policy && (
          <p className="mt-3 text-xs text-zinc-500">
            {formatAllowedExtensions(policy.allowedExtensions)} files. {formatFileSize(policy.maxFileSizeBytes)} each.
          </p>
        )}
      </div>

      <Dialog
        open={attachmentToDelete !== null}
        onOpenChange={(open) => !open && cancelDelete()}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete file?</DialogTitle>
            <DialogDescription>
              This will remove {attachmentToDelete?.originalFileName}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 p-4">
            {deleteErrorMessage && (
              <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                {deleteErrorMessage}
              </p>
            )}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={cancelDelete}
                disabled={deleteAttachment.isPending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteAttachment.isPending}
              >
                <TrashIcon />
                {deleteAttachment.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}

function isAllowedFile(file: File, allowedExtensions: string[]) {
  const extension = `.${file.name.split(".").pop() ?? ""}`.toLowerCase()
  return allowedExtensions.some((allowedExtension) => allowedExtension.toLowerCase() === extension)
}

function formatAllowedExtensions(extensions: string[]) {
  return extensions.map((extension) => extension.slice(1).toUpperCase()).join(", ")
}

function formatFileSize(sizeBytes: number) {
  if (sizeBytes < 1024) return `${sizeBytes} B`
  if (sizeBytes < 1024 * 1024) return `${Math.round(sizeBytes / 1024)} KB`
  return `${(sizeBytes / (1024 * 1024))} MB`
}

function formatAttachmentDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}
