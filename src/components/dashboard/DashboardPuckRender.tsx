import type { Data } from '@puckeditor/core'
import { Render } from '@puckeditor/core'
import { useMemo } from 'react'
import { dashboardPuckConfig } from '../puck-editor/dashboardPuckConfig'
import {
  buildDashboardPuckDataFromState,
  hydrateDashboardPuckMetrics,
  type DashboardOverviewStatePayload,
} from '../../lib/dashboardOverviewStorage'

function normalizedPuckLocal(): Data | null {
  try {
    const raw = localStorage.getItem('dashboard-puck-data')
    if (!raw?.trim()) return null
    const parsed = JSON.parse(raw) as Partial<Data>
    if (!Array.isArray(parsed.content) || parsed.content.length === 0) return null
    return {
      content: parsed.content,
      root: parsed.root ?? { props: {} },
      zones: parsed.zones ?? {},
    }
  } catch {
    return null
  }
}

function mergeWithLiveMetricCopy(data: Data, metrics: DashboardOverviewStatePayload['metrics']): Data {
  const content = hydrateDashboardPuckMetrics([...(data.content ?? [])], metrics)
  return { ...data, content }
}

/**
 * Puck read-only renderer for Home dashboard (metrics, layouts, cards).
 * Prefers customized canvas from storage; hydrates overview tiles with the latest metric copy from the store.
 */
export function DashboardPuckRender({ metrics, layoutOrder, puckContent }: DashboardOverviewStatePayload) {
  const puckData = useMemo<Data>(() => {
    const baseline = mergeWithLiveMetricCopy(
      buildDashboardPuckDataFromState({
        metrics,
        layoutOrder,
        ...(Array.isArray(puckContent) && puckContent.length > 0 ? { puckContent } : {}),
      }),
      metrics,
    )
    const fromLocal = normalizedPuckLocal()
    return fromLocal ? mergeWithLiveMetricCopy(fromLocal, metrics) : baseline
  }, [metrics, layoutOrder, puckContent])

  return <Render config={dashboardPuckConfig} data={puckData} />
}
