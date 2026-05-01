import { Link } from 'react-router-dom'
import { ThemeToggle } from '../components/ThemeToggle'

export const NotFoundPage = () => (
  <div className="relative flex min-h-screen items-center justify-center bg-transparent p-4">
    <div className="absolute right-4 top-4">
      <ThemeToggle />
    </div>
    <div className="rounded-2xl border border-violet-200/70 bg-white/90 px-8 py-10 text-center shadow-xl shadow-violet-200/25 backdrop-blur-sm dark:border-violet-500/25 dark:bg-slate-950/75 dark:shadow-violet-900/35">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-violet-100">404</h1>
      <p className="mt-2 text-violet-700/80 dark:text-violet-300/80">The page you requested was not found.</p>
      <Link
        to="/dashboard/view"
        className="mt-4 inline-block rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-white shadow-sm shadow-violet-400/30 hover:from-violet-500 hover:to-indigo-500"
      >
        Go to Dashboard
      </Link>
    </div>
  </div>
)
