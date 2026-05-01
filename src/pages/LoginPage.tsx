import { useEffect, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Input, PasswordInput } from '../components/ui/Input'
import { ThemeToggle } from '../components/ThemeToggle'
import { useAuthStore } from '../store/authStore'

type LocationState = {
  from?: { pathname?: string }
}

function searchHasAnyValue(search: string, needle: string) {
  const raw = search.replace(/^\?/, '')
  if (!raw) return false
  for (const pair of raw.split('&')) {
    if (!pair) continue
    const eq = pair.indexOf('=')
    const encoded = eq === -1 ? '' : pair.slice(eq + 1)
    let value: string
    try {
      value = decodeURIComponent(encoded.replace(/\+/g, ' '))
    } catch {
      value = encoded
    }
    if (value === needle) return true
  }
  return false
}

export const LoginPage = () => {
  const user = useAuthStore((state) => state.user)
  const login = useAuthStore((state) => state.login)
  const signup = useAuthStore((state) => state.signup)
  const loading = useAuthStore((state) => state.loading)
  const error = useAuthStore((state) => state.error)
  const successMessage = useAuthStore((state) => state.successMessage)
  const clearError = useAuthStore((state) => state.clearError)
  const clearSuccessMessage = useAuthStore((state) => state.clearSuccessMessage)

  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [localError, setLocalError] = useState<string | null>(null)

  const state = location.state as LocationState | null
  const redirectPath = state?.from?.pathname ?? '/dashboard/view'

  useEffect(() => {
    if (user) navigate(redirectPath, { replace: true })
  }, [navigate, redirectPath, user])

  useEffect(() => {
    if (!searchHasAnyValue(location.search, 'demo')) return
    setEmail('john@test.com')
    setPassword('123456')
  }, [location.search])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match.')
        clearSuccessMessage()
        return
      }
      setLocalError(null)
      await signup({ email, password })
      return
    }

    setLocalError(null)
    await login({ email, password })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent p-4">
      <img
        src="/healthcare-login-illustration.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 dark:opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/65 via-white/80 to-white/70 dark:from-slate-950/70 dark:via-slate-950/82 dark:to-slate-950/78" />
      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>
      <div className="relative z-[1] mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-6xl items-center justify-center">
        <section className="w-full max-w-md overflow-hidden rounded-2xl border border-violet-200/70 bg-white/92 shadow-xl shadow-violet-200/30 backdrop-blur-md dark:border-violet-500/25 dark:bg-slate-950/78 dark:shadow-violet-900/40">
          <form onSubmit={onSubmit} className="w-full space-y-4 p-6 sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-300">
                CareFlow Portal
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-violet-100">
                {mode === 'signin' ? 'Welcome back' : 'Create your account'}
              </h1>
              <p className="mt-1 text-sm text-violet-700/80 dark:text-violet-300/80">
                {mode === 'signin'
                  ? 'Sign in to access patient management, analytics, and operational alerts.'
                  : 'Set up your access to begin managing healthcare operations securely.'}
              </p>
            </div>

            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Work Email
              <Input
                className="mt-1"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (localError) setLocalError(null)
                  if (error) clearError()
                  if (successMessage) clearSuccessMessage()
                }}
                type="email"
                placeholder="doctor@hospital.com"
                required
              />
            </label>

            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
              <PasswordInput
                className="mt-1"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (localError) setLocalError(null)
                  if (error) clearError()
                  if (successMessage) clearSuccessMessage()
                }}
                placeholder="••••••••"
                required
              />
            </label>

            {mode === 'signup' ? (
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Confirm Password
                <PasswordInput
                  className="mt-1"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (localError) setLocalError(null)
                    if (error) clearError()
                    if (successMessage) clearSuccessMessage()
                  }}
                  placeholder="••••••••"
                  required
                />
              </label>
            ) : null}

            {localError ? (
              <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                {localError}
              </p>
            ) : null}

            {error ? (
              <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                {error}
              </p>
            ) : null}

            {successMessage ? (
              <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                {successMessage}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 font-medium text-white shadow-sm shadow-violet-400/30 hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading
                ? mode === 'signin'
                  ? 'Signing in...'
                  : 'Creating account...'
                : mode === 'signin'
                  ? 'Sign in'
                  : 'Create account'}
            </button>

            <button
              type="button"
              onClick={() => {
                const nextMode = mode === 'signin' ? 'signup' : 'signin'
                setMode(nextMode)
                setPassword('')
                setConfirmPassword('')
                setLocalError(null)
                clearError()
                clearSuccessMessage()
              }}
              className="w-full text-sm font-medium text-violet-700 hover:text-violet-600 dark:text-violet-300 dark:hover:text-violet-200"
            >
              {mode === 'signin'
                ? "Don't have an account? Create one"
                : 'Already have an account? Sign in'}
            </button>

            <p className="pt-1 text-center text-xs text-violet-700/70 dark:text-violet-300/70">
              By continuing, you agree to accept the Terms & Conditions.
            </p>
          </form>
        </section>
      </div>
    </div>
  )
}
