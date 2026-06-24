import type { ReactNode } from "react"
import { PencilSimpleIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

type SectionHeaderProps = {
  title: string
  icon: ReactNode
  isEditing: boolean
  onEdit: () => void
}

export function SectionHeader({
  title,
  icon,
  isEditing,
  onEdit,
}: SectionHeaderProps) {
  return (
    <header className="flex min-h-12 items-center justify-between gap-3 px-5 py-3 sm:px-6">
      <div className="flex items-center gap-2 text-zinc-500">
        {icon}
        <h2 className="text-sm font-semibold uppercase text-zinc-700">
          {title}
        </h2>
      </div>
      {!isEditing && (
        <Button type="button" variant="ghost" size="sm" onClick={onEdit}>
          <PencilSimpleIcon />
          Edit
        </Button>
      )}
    </header>
  )
}
