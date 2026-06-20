import { cn } from "@/lib/utils"

export function DashboardSidebar() {
  return (
    <aside className="border-b border-zinc-200 bg-white px-4 py-4 lg:min-h-screen lg:w-64 lg:border-r lg:border-b-0 lg:px-5">
      <div className="flex items-center justify-between lg:block">
        <div>
          <p className="text-xs text-zinc-500">Job Application Tracker</p>
          <h1 className="mt-1 text-xl font-semibold">Dashboard</h1>
        </div>
      </div>

      <nav className="mt-6 flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
        {["Applications", "Calendar"].map((item) => (
          <button
            key={item}
            className={cn(
              "h-9 shrink-0 cursor-pointer border px-3 text-left text-sm transition-colors",
              item === "Applications"
                ? "border-zinc-950 bg-zinc-950 text-white"
                : "border-transparent text-zinc-600 hover:border-zinc-200 hover:bg-zinc-50"
            )}
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  )
}
