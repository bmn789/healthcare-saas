import { useEffect, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

type LocationState = {
  from?: { pathname?: string }
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
  const redirectPath = state?.from?.pathname ?? '/dashboard'

  useEffect(() => {
    if (user) navigate(redirectPath, { replace: true })
  }, [navigate, redirectPath, user])

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
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {mode === 'signin' ? 'Healthcare SaaS Login' : 'Create your account'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {mode === 'signin'
              ? 'Sign in to access dashboard, analytics, and patient details.'
              : 'Sign up to create a new account and access the platform.'}
          </p>
        </div>

        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (localError) setLocalError(null)
              if (error) clearError()
              if (successMessage) clearSuccessMessage()
            }}
            type="email"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-blue-300 focus:ring"
            placeholder="doctor@hospital.com"
            required
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Password
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (localError) setLocalError(null)
              if (error) clearError()
              if (successMessage) clearSuccessMessage()
            }}
            type="password"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-blue-300 focus:ring"
            placeholder="••••••••"
            required
          />
        </label>

        {mode === 'signup' ? (
          <label className="block text-sm font-medium text-slate-700">
            Confirm Password
            <input
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                if (localError) setLocalError(null)
                if (error) clearError()
                if (successMessage) clearSuccessMessage()
              }}
              type="password"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-blue-300 focus:ring"
              placeholder="••••••••"
              required
            />
          </label>
        ) : null}

        {localError ? (
          <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {localError}
          </p>
        ) : null}

        {error ? (
          <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        {successMessage ? (
          <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {successMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
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
          className="w-full text-sm font-medium text-blue-700 hover:text-blue-600"
        >
          {mode === 'signin'
            ? "Don't have an account? Create one"
            : 'Already have an account? Sign in'}
        </button>
      </form>
    </div>
  )
}
