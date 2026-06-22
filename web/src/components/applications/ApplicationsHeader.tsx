import { PlusIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

export function ApplicationsHeader({
  onAddApplication,
}: {
  onAddApplication: () => void
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-zinc-200 pb-5 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="mt-1 text-2xl font-semibold sm:text-3xl">
          Applications
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Track your applications, interviews, and follow-ups in one place.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={onAddApplication}>
          <PlusIcon />
          Add application
        </Button>
      </div>
    </header>
  )
}
