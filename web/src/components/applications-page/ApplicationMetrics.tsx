import {
  ArrowSquareOutIcon,
  BriefcaseIcon,
  CalendarCheckIcon,
  TrendUpIcon,
} from "@phosphor-icons/react"
import { ApplicationMetricCard } from "@/components/applications-page/ApplicationMetricCard"
import { isDateInCurrentWeek } from "@/lib/application-utils"
import { useApplicationsQuery } from "@/queries/applications"

export function ApplicationMetrics() {
  const applicationsQuery = useApplicationsQuery()
  const applications = applicationsQuery.data ?? []

  const activeCount = applications.filter((application) =>
    ["Applied", "Interviewing", "Offered"].includes(application.status)
  ).length
  
  const interviewCount = applications.filter((application) =>
    application.status === "Interviewing"
  ).length
  
  const interviewsThisWeekCount = applications.filter((application) =>
    application.status === "Interviewing" &&
    isDateInCurrentWeek(application.interviewDate)
  ).length
  
  const appliedCount = applications.filter((application) =>
    application.status === "Applied"
  ).length

  return (
    <section className="grid gap-3 py-5 sm:grid-cols-2 xl:grid-cols-4">
      <ApplicationMetricCard
        icon={<BriefcaseIcon />}
        label="Tracked roles"
        value={applications.length.toString()}
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
