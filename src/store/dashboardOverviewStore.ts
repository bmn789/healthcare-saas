import { create } from 'zustand'
import {
  type DashboardMetricId,
  DEFAULT_DASHBOARD_LAYOUT_ORDER,
  DEFAULT_DASHBOARD_METRICS,
  loadDashboardOverviewFromStorage,
  persistDashboardOverviewState,
  clearAllDashboardCustomizationLocalStorage,
  type DashboardOverviewStatePayload,
} from '../lib/dashboardOverviewStorage'

const boot = loadDashboardOverviewFromStorage()

export type DashboardOverviewStore = {
  metrics: DashboardOverviewStatePayload['metrics']
  layoutOrder: DashboardMetricId[]
  puckContent: DashboardOverviewStatePayload['puckContent']
  /** True when `healthcare-saas:dashboard-overview-v1` was present and valid at load, or after a successful apply. */
  hasSavedDashboardOverview: boolean
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
  hasSavedDashboardOverview: boot.ok && !boot.empty,
  hadStorageCorruption: !boot.ok && !boot.empty,
  puckCustomizeUiEnabled: boot.ok,
  applyDashboardOverview: (payload) => {
    persistDashboardOverviewState(payload)
    set({ ...payload, hadStorageCorruption: false, puckCustomizeUiEnabled: true, hasSavedDashboardOverview: true })
  },
  resetToBundledDefaults: () => {
    clearAllDashboardCustomizationLocalStorage()
    set({
      metrics: { ...DEFAULT_DASHBOARD_METRICS },
      layoutOrder: [...DEFAULT_DASHBOARD_LAYOUT_ORDER],
      puckContent: undefined,
      hadStorageCorruption: false,
      puckCustomizeUiEnabled: true,
      hasSavedDashboardOverview: false,
    })
  },
  dismissCorruptionBanner: () => set({ hadStorageCorruption: false }),
}))
