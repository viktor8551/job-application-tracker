import {
  ArrowSquareOutIcon,
  BriefcaseIcon,
  CalendarCheckIcon,
  TrendUpIcon,
} from "@phosphor-icons/react"
import { ApplicationMetricCard } from "@/components/applications/ApplicationMetricCard"

export function ApplicationMetrics({
  trackedCount,
  activeCount,
  appliedCount,
  interviewCount,
  interviewsThisWeekCount,
}: {
  trackedCount: number
  activeCount: number
  appliedCount: number
  interviewCount: number
  interviewsThisWeekCount: number
}) {
  return (
    <section className="grid gap-3 py-5 sm:grid-cols-2 xl:grid-cols-4">
      <ApplicationMetricCard
        icon={<BriefcaseIcon />}
        label="Tracked roles"
        value={trackedCount.toString()}
        detail="All applications"
      />
      <ApplicationMetricCard
        icon={<TrendUpIcon />}
        label="Active"
        value={activeCount.toString()}
        detail="Applied or later"
      />
      <ApplicationMetricCard
        icon={<ArrowSquareOutIcon />}
        label="Applied"
        value={appliedCount.toString()}
        detail="Waiting for response"
      />
      <ApplicationMetricCard
        icon={<CalendarCheckIcon />}
        label="Interviews"
        value={interviewCount.toString()}
        detail={`${interviewsThisWeekCount} this week`}
      />
    </section>
  )
}
