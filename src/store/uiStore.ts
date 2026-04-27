import { create } from 'zustand'

type PatientView = 'grid' | 'list'

type UIState = {
  patientView: PatientView
  setPatientView: (view: PatientView) => void
}

export const useUIStore = create<UIState>((set) => ({
  patientView: 'grid',
  setPatientView: (view) => set({ patientView: view }),
}))
