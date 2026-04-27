import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { create } from 'zustand'
import { auth, firebaseConfigured } from '../lib/firebase'

type Credentials = {
  email: string
  password: string
}

type AuthState = {
  user: User | null
  loading: boolean
  authReady: boolean
  error: string | null
  successMessage: string | null
  login: (credentials: Credentials) => Promise<void>
  signup: (credentials: Credentials) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
  clearSuccessMessage: () => void
  initAuthListener: () => () => void
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const getLoginErrorMessage = (error: unknown) => {
  if (!(error instanceof FirebaseError)) {
    return 'Login failed unexpectedly. Please try again.'
  }

  switch (error.code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password. Please try again.'
    case 'auth/invalid-email':
      return 'Invalid email format.'
    case 'auth/too-many-requests':
      return 'Too many login attempts. Please wait and try again.'
    case 'auth/network-request-failed':
      return 'Network issue while signing in. Check your connection.'
    case 'auth/api-key-not-valid':
      return 'Firebase API key is invalid. Verify your .env configuration.'
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized in Firebase Authentication settings.'
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is disabled in Firebase console.'
    case 'auth/configuration-not-found':
      return 'Firebase Auth configuration is missing. Enable Authentication and at least one sign-in provider in Firebase console.'
    default:
      return `Login failed (${error.code}).`
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  authReady: false,
  error: null,
  successMessage: null,
  clearError: () => set({ error: null }),
  clearSuccessMessage: () => set({ successMessage: null }),
  initAuthListener: () =>
    onAuthStateChanged(auth, (user) => {
      set({ user, authReady: true })
    }),
  login: async ({ email, password }) => {
    if (!firebaseConfigured) {
      set({
        error:
          'Firebase is not configured. Add VITE_FIREBASE_* values in your .env file.',
      })
      return
    }

    if (!EMAIL_REGEX.test(email)) {
      set({ error: 'Please enter a valid email address.' })
      return
    }

    if (password.length < 6) {
      set({ error: 'Password should be at least 6 characters.' })
      return
    }

    set({ loading: true, error: null, successMessage: null })
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error('Firebase login failed:', error)
      set({
        error: getLoginErrorMessage(error),
      })
    } finally {
      set({ loading: false })
    }
  },
  signup: async ({ email, password }) => {
    if (!firebaseConfigured) {
      set({
        error:
          'Firebase is not configured. Add VITE_FIREBASE_* values in your .env file.',
      })
      return
    }

    if (!EMAIL_REGEX.test(email)) {
      set({ error: 'Please enter a valid email address.' })
      return
    }

    if (password.length < 6) {
      set({ error: 'Password should be at least 6 characters.' })
      return
    }

    set({ loading: true, error: null, successMessage: null })
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      set({ successMessage: 'Account created successfully. You are now signed in.' })
    } catch (error) {
      console.error('Firebase signup failed:', error)
      if (error instanceof FirebaseError && error.code === 'auth/email-already-in-use') {
        set({ error: 'This email is already registered. Please sign in instead.' })
      } else {
        set({ error: getLoginErrorMessage(error) })
      }
    } finally {
      set({ loading: false })
    }
  },
  logout: async () => {
    await signOut(auth)
  },
}))
