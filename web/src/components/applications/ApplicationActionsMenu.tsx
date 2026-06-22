import { Button } from "@/components/ui/button"
import {
  ArrowSquareOutIcon,
  DotsThreeIcon,
  TrashIcon,
} from "@phosphor-icons/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ApplicationActionsMenu({
  isOpen,
  onOpenChange,
  onOpen,
  onDelete,
}: {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onOpen: () => void
  onDelete: () => void
}) {
  return (
    <DropdownMenu modal={false} open={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Application actions"
        >
          <DotsThreeIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" data-application-actions-menu>
        <DropdownMenuItem onClick={onOpen}>
          <ArrowSquareOutIcon className="size-3.5" />
          Open details
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={onDelete}>
          <TrashIcon className="size-3.5" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
