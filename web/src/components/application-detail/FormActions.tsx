import { Button } from "@/components/ui/button"

type FormActionsProps = {
  isSaving: boolean
  errorMessage: string | null
  onCancel: () => void
}

export function FormActions({
  isSaving,
  errorMessage,
  onCancel,
}: FormActionsProps) {
  return (
    <>
      {errorMessage && (
        <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {errorMessage}
        </p>
      )}

      <div className="flex flex-col-reverse gap-2 border-t border-zinc-200 pt-4 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          disabled={isSaving}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </>
  )
}
