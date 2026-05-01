import { create } from 'zustand'

type ListView = 'grid' | 'list'

type UIState = {
  patientView: ListView
  setPatientView: (view: ListView) => void
  notificationView: ListView
  setNotificationView: (view: ListView) => void
}

export const useUIStore = create<UIState>((set) => ({
  patientView: 'grid',
  setPatientView: (view) => set({ patientView: view }),
  notificationView: 'grid',
  setNotificationView: (view) => set({ notificationView: view }),
}))
