import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AppLayout } from './components/layout/AppLayout'
import { DashboardRootRedirect } from './components/routing/DashboardRootRedirect'
import { useNotifications } from './hooks/useNotifications'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { DashboardCustomizePage } from './pages/DashboardCustomizePage'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { PatientDetailsPage } from './pages/PatientDetailsPage'
import { useAuthStore } from './store/authStore'

function App() {
  const initAuthListener = useAuthStore((state) => state.initAuthListener)
  useNotifications()

  useEffect(() => {
    const unsubscribe = initAuthListener()
    return unsubscribe
  }, [initAuthListener])

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard/view" replace />} />
        <Route path="dashboard/view" element={<DashboardPage />} />
        <Route path="dashboard/customization" element={<DashboardCustomizePage />} />
        <Route path="dashboard/customize" element={<Navigate to="/dashboard/customization" replace />} />
        <Route path="dashboard" element={<DashboardRootRedirect />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="patients" element={<PatientDetailsPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
