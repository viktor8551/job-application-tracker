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
    path: "/dashboard",
  },
  {
    id: "calendar",
    label: "Calendar",
    path: "/calendar",
  },
]
