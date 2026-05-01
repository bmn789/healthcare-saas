import { create } from 'zustand'
import {
  type DashboardMetricId,
  DEFAULT_DASHBOARD_LAYOUT_ORDER,
  DEFAULT_DASHBOARD_METRICS,
  loadDashboardOverviewFromStorage,
  persistDashboardOverviewState,
  clearDashboardOverviewStorage,
  type DashboardOverviewStatePayload,
} from '../lib/dashboardOverviewStorage'

const boot = loadDashboardOverviewFromStorage()

export type DashboardOverviewStore = {
  metrics: DashboardOverviewStatePayload['metrics']
  layoutOrder: DashboardMetricId[]
  puckContent: DashboardOverviewStatePayload['puckContent']
  hadStorageCorruption: boolean
  puckCustomizeUiEnabled: boolean
  /** Persists metrics + tile order from JSON recovery or Puck apply. */
  applyDashboardOverview: (payload: DashboardOverviewStatePayload) => void
  resetToBundledDefaults: () => void
  dismissCorruptionBanner: () => void
}

export const useDashboardOverviewStore = create<DashboardOverviewStore>((set) => ({
  metrics: boot.ok ? boot.metrics : { ...DEFAULT_DASHBOARD_METRICS },
  layoutOrder: boot.ok ? boot.layoutOrder : [...DEFAULT_DASHBOARD_LAYOUT_ORDER],
  puckContent: boot.ok ? boot.puckContent : undefined,
  hadStorageCorruption: !boot.ok && !boot.empty,
  puckCustomizeUiEnabled: boot.ok,
  applyDashboardOverview: (payload) => {
    persistDashboardOverviewState(payload)
    set({ ...payload, hadStorageCorruption: false, puckCustomizeUiEnabled: true })
  },
  resetToBundledDefaults: () => {
    clearDashboardOverviewStorage()
    set({
      metrics: { ...DEFAULT_DASHBOARD_METRICS },
      layoutOrder: [...DEFAULT_DASHBOARD_LAYOUT_ORDER],
      puckContent: undefined,
      hadStorageCorruption: false,
      puckCustomizeUiEnabled: true,
    })
  },
  dismissCorruptionBanner: () => set({ hadStorageCorruption: false }),
}))
