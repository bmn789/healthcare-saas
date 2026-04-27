import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

type ProtectedRouteProps = {
  children: ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const user = useAuthStore((state) => state.user)
  const authReady = useAuthStore((state) => state.authReady)
  const location = useLocation()

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">Checking session...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <>{children}</>
}
