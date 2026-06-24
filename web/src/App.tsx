import { Navigate, Route, Routes } from "react-router-dom"
import { DashboardLayout } from "@/layouts/DashboardLayout"
import { ApplicationsPage } from "@/pages/ApplicationsPage"
import { CalendarPage } from "@/pages/CalendarPage"
import { ApplicationDetailPage } from "@/pages/ApplicationDetailPage"
import { NotFoundPage } from "@/pages/NotFoundPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/applications" replace/>}/>
      <Route element={<DashboardLayout/>}>
        <Route path="/applications" element={<ApplicationsPage/>}/>
        <Route path="/calendar" element={<CalendarPage/>}/>
      </Route>
      <Route path="/applications/:applicationId" element={<ApplicationDetailPage/>}/>
      <Route path="*" element={<NotFoundPage/>}/>
    </Routes>
  )
}

export default App
