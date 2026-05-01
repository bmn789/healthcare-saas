import { Navigate, useSearchParams } from 'react-router-dom'

/** Maps legacy `/dashboard?id=1` to customization; everything else to the main view. */
export function DashboardRootRedirect() {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const to = id === '1' ? '/dashboard/customization' : '/dashboard/view'
  return <Navigate to={to} replace />
}
