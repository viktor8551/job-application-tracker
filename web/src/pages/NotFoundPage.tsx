import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  const navigate = useNavigate()

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
