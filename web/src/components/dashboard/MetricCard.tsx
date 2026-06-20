import type { ReactNode } from "react"

export function MetricCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: ReactNode
  label: string
  value: string
  detail: string
}) {
  return (
    <article className="border border-zinc-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-zinc-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold">{value}</p>
        </div>
        <div className="flex size-9 items-center justify-center border border-zinc-200 bg-zinc-50 text-zinc-700">
          {icon}
        </div>
      </div>
      <p className="mt-3 text-xs text-zinc-500">{detail}</p>
    </article>
  )
}

