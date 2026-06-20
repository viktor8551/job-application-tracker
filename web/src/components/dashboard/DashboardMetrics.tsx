import {
  ArrowSquareOutIcon,
  BriefcaseIcon,
  CalendarCheckIcon,
  TrendUpIcon,
} from "@phosphor-icons/react"
import { MetricCard } from "@/components/dashboard/MetricCard"

export function DashboardMetrics({
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
      <MetricCard
        icon={<BriefcaseIcon />}
        label="Tracked roles"
        value={trackedCount.toString()}
        detail="All applications"
      />
      <MetricCard
        icon={<TrendUpIcon />}
        label="Active"
        value={activeCount.toString()}
        detail="Applied or later"
      />
      <MetricCard
        icon={<ArrowSquareOutIcon />}
        label="Applied"
        value={appliedCount.toString()}
        detail="Waiting for response"
      />
      <MetricCard
        icon={<CalendarCheckIcon />}
        label="Interviews"
        value={interviewCount.toString()}
        detail={`${interviewsThisWeekCount} this week`}
      />
    </section>
  )
}
