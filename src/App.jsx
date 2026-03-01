import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar          from './components/Navbar'
import ProjectsList    from './pages/ProjectsList'
import ProjectDetail   from './pages/ProjectDetail'
import Confirmation    from './pages/Confirmation'
import DashboardHome   from './pages/dashboard/DashboardHome'
import ProjectDashboard from './pages/dashboard/ProjectDashboard'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar />
        <Routes>
          <Route path="/"                        element={<ProjectsList />}     />
          <Route path="/projects/:id"            element={<ProjectDetail />}    />
          <Route path="/projects/:id/thank-you"  element={<Confirmation />}     />
          <Route path="/dashboard"               element={<DashboardHome />}    />
          <Route path="/dashboard/:id"           element={<ProjectDashboard />} />
          <Route path="*"                        element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
