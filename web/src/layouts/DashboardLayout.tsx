import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import {
  dashboardNavigationItems,
  type DashboardPage,
} from "@/lib/dashboard-navigation"

export function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const activePage = dashboardNavigationItems.find(
    (item) => item.path === location.pathname
  )?.id ?? "applications"

  function navigateToPage(page: DashboardPage) {
    const navigationItem = dashboardNavigationItems.find(
      (item) => item.id === page
    )

    if (navigationItem) {
      navigate(navigationItem.path)
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-zinc-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col lg:flex-row">
        <DashboardSidebar
          activePage={activePage}
          onNavigate={navigateToPage}
        />

        <section className="flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <Outlet />
        </section>
      </div>
    </main>
  )
}
