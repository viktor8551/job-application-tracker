import { cn } from "@/lib/utils"
import { statusStyles } from "@/lib/application-constants"
import type { ApplicationStatus } from "@/types/applications"

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 w-fit items-center gap-1 border px-2 text-xs",
        statusStyles[status]
      )}
    >
      {status}
    </span>
  )
}
