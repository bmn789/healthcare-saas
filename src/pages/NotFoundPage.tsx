import { Link } from 'react-router-dom'

export const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-slate-900">404</h1>
      <p className="mt-2 text-slate-600">The page you requested was not found.</p>
      <Link
        to="/dashboard"
        className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
      >
        Go to Dashboard
      </Link>
    </div>
  </div>
)
