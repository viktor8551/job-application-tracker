import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type FormFieldProps = {
  label: string
  children: ReactNode
  className?: string
}

export function FormField({ label, children, className }: FormFieldProps) {
  return (
    <label className={cn("block", className)}>
      <span className="text-xs text-zinc-500">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}
