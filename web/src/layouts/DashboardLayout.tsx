import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"

export function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const activeSection = location.pathname === "/calendar" ? "Calendar" : "Applications"

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-zinc-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col lg:flex-row">
        <DashboardSidebar
          activeSection={activeSection}
          onNavigate={(section) => {
            navigate(section === "Calendar" ? "/calendar" : "/dashboard")
          }}
        />

        <section className="flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <Outlet />
        </section>
      </div>
    </main>
  )
}
