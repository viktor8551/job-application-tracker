export type DashboardPage = "applications" | "calendar"

export type DashboardNavigationItem = {
  id: DashboardPage
  label: string
  path: string
}

export const dashboardNavigationItems: DashboardNavigationItem[] = [
  {
    id: "applications",
    label: "Applications",
    path: "/applications",
  },
  {
    id: "calendar",
    label: "Calendar",
    path: "/calendar",
  },
]
