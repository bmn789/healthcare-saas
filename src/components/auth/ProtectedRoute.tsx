import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { ThemeToggle } from '../ThemeToggle'

type ProtectedRouteProps = {
  children: ReactNode
}

/** Card body aligned with `LoginPage` typography (CareFlow Portal + hierarchy). */
function SessionLoadingCard() {
  return (
    <div className="w-full space-y-6 p-6 sm:p-8">
      <div className="flex justify-center">
        <div className="relative flex h-[4.75rem] w-[4.75rem] items-center justify-center">
          <span className="absolute inset-[-6px] rounded-[1.35rem] border border-violet-300/50 dark:border-violet-500/30 motion-reduce:animate-none animate-[spin_12s_linear_infinite]" />
          <span className="absolute inset-[-2px] rounded-[1.2rem] border border-transparent bg-gradient-to-br from-violet-500/20 via-transparent to-indigo-500/20 motion-reduce:animate-none animate-[pulse_4s_ease-in-out_infinite]" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/40 ring-4 ring-white/80 dark:from-violet-500 dark:to-indigo-500 dark:ring-slate-900/80">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-300">
          CareFlow Portal
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-violet-100">
          Checking session
        </h1>
        <p className="mt-1 text-sm leading-relaxed text-violet-700/80 dark:text-violet-300/80">
          Hang tight while we confirm your account so you can reach patient management,
          analytics, and alerts.
        </p>
      </div>

      <div className="flex justify-center gap-1.5" aria-hidden>
        <span className="h-2 w-2 rounded-full bg-violet-500 motion-reduce:animate-none animate-bounce [animation-duration:0.9s]" />
        <span className="h-2 w-2 rounded-full bg-indigo-500 motion-reduce:animate-none animate-bounce [animation-duration:0.9s] [animation-delay:120ms]" />
        <span className="h-2 w-2 rounded-full bg-sky-500 motion-reduce:animate-none animate-bounce [animation-duration:0.9s] [animation-delay:240ms]" />
      </div>

      <p className="text-center text-[0.65rem] font-medium uppercase tracking-[0.28em] text-violet-500/90 dark:text-violet-300/85">
        Secure session check
      </p>
    </div>
  )
}

/** Same shell as `LoginPage`: illustration, veil, theme toggle, centered card. */
function SessionCheckingView() {
  return (
    <div
      className="relative min-h-screen overflow-hidden bg-transparent p-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Checking session"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/65 via-white/80 to-white/70 dark:from-slate-950/70 dark:via-slate-950/82 dark:to-slate-950/78" />
      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>
      <div className="relative z-[1] mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-6xl items-center justify-center">
        <section className="w-full max-w-md overflow-hidden rounded-2xl border border-violet-200/70 bg-white/92 shadow-xl shadow-violet-200/30 backdrop-blur-md dark:border-violet-500/25 dark:bg-slate-950/78 dark:shadow-violet-900/40">
          <SessionLoadingCard />
        </section>
      </div>
    </div>
  )
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const user = useAuthStore((state) => state.user)
  const authReady = useAuthStore((state) => state.authReady)
  const location = useLocation()

  if (!authReady) {
    return <SessionCheckingView />
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <>{children}</>
}
