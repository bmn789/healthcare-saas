import { create } from 'zustand'

const STORAGE_KEY = 'starred-patients'

function readStored(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

function writeStored(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    /* ignore */
  }
}

type StarredPatientsState = {
  ids: string[]
  toggle: (patientId: string) => void
}

export const useStarredPatientsStore = create<StarredPatientsState>((set, get) => ({
  ids: readStored(),
  toggle: (patientId) => {
    const cur = get().ids
    const next = cur.includes(patientId) ? cur.filter((id) => id !== patientId) : [...cur, patientId]
    writeStored(next)
    set({ ids: next })
  },
}))
