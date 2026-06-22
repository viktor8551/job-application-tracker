import { Navigate, Route, Routes } from "react-router-dom"
import { DashboardLayout } from "@/layouts/DashboardLayout"
import { DashboardPage } from "@/pages/DashboardPage"
import { CalendarPage } from "@/pages/CalendarPage"
import { ApplicationDetailPage } from "@/pages/ApplicationDetailPage"
import { NotFoundPage } from "@/pages/NotFoundPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />}/>
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />}/>
        <Route path="/calendar" element={<CalendarPage />}/>
      </Route>
      <Route path="/applications/:applicationId" element={<ApplicationDetailPage />}/>
      <Route path="*" element={<NotFoundPage />}/>
    </Routes>
  )
}

export default App
