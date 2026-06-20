import type { ApplicationStatus } from "@/types/applications"

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5088"

export const applicationStatuses: ApplicationStatus[] = [
  "Interested",
  "Applied",
  "Interviewing",
  "Offered",
  "Rejected",
  "Withdrawn",
]

export const filterStatuses: Array<"All" | ApplicationStatus> = [
  "All",
  ...applicationStatuses.filter((status) => status !== "Withdrawn"),
]

export const statusStyles: Record<ApplicationStatus, string> = {
  Interested: "border-sky-200 bg-sky-50 text-sky-800",
  Applied: "border-zinc-200 bg-zinc-50 text-zinc-700",
  Interviewing: "border-amber-200 bg-amber-50 text-amber-800",
  Offered: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Rejected: "border-red-200 bg-red-50 text-red-800",
  Withdrawn: "border-stone-200 bg-stone-50 text-stone-700",
}
