import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ApplicationDetailPage } from "@/pages/ApplicationDetailPage"
import { DashboardPage } from "@/pages/DashboardPage"

function getInitialPathname() {
  if (window.location.pathname === "/") {
    window.history.replaceState(null, "", "/dashboard")
    return "/dashboard"
  }

  return window.location.pathname
}

function getApplicationIdFromPath(pathname: string) {
  const match = pathname.match(/^\/applications\/(\d+)$/)

  if (!match) {
    return null
  }

  return Number(match[1])
}

function App() {
  const [pathname, setPathname] = useState(getInitialPathname)

  useEffect(() => {
    function handlePopState() {
      setPathname(getInitialPathname())
    }

    window.addEventListener("popstate", handlePopState)

    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  function navigate(path: string) {
    window.history.pushState(null, "", path)
    setPathname(path)
  }

  const applicationId = getApplicationIdFromPath(pathname)

  if (pathname === "/" || pathname === "/dashboard") {
    return (
      <DashboardPage
        onOpenApplication={(id) => navigate(`/applications/${id}`)}
      />
    )
  }

  if (applicationId) {
    return (
      <ApplicationDetailPage
        applicationId={applicationId}
        onBack={() => navigate("/dashboard")}
      />
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f4] px-4 text-zinc-950">
      <section className="border border-zinc-200 bg-white p-6">
        <p className="text-sm text-zinc-500">Page not found</p>
        <h1 className="mt-2 text-2xl font-semibold">
          This route does not exist.
        </h1>
        <Button className="mt-4" onClick={() => navigate("/dashboard")}>
          Go to dashboard
        </Button>
      </section>
    </main>
  )
}

export default App
