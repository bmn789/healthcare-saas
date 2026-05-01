import type { ComponentData, Data } from '@puckeditor/core'
import dashboardFixture from '../data/dashboard.json'
import dashboardPuckDefaultFixture from '../components/puck-editor/dash_default.json'
import { parseStoredPuckContent, shallowClonePuckContent, walkPuckContentPreorder } from './puckNestedContent'

const STORAGE_KEY = 'healthcare-saas:dashboard-overview-v1'

/** `localStorage` draft from the visual Puck customize flow; overlays overview storage until cleared. */
export const DASHBOARD_PUCK_DRAFT_LS_KEY = 'dashboard-puck-data'

function assertBundledPuckFixture(): ComponentData[] {
  const parsed = parseStoredPuckContent(dashboardPuckDefaultFixture.content as unknown)
  if (!parsed?.length) {
    throw new Error('dashboard puck default fixture: invalid or empty content (dash_default.json)')
  }
  return parsed
}

/** Validated once at startup from `dash_default.json`. */
const BUNDLED_DASHBOARD_PUCK_CONTENT = assertBundledPuckFixture()

export function cloneBundledDefaultPuckContent(): ComponentData[] {
  return shallowClonePuckContent(BUNDLED_DASHBOARD_PUCK_CONTENT)
}

export const DASHBOARD_METRIC_IDS = ['activePatients', 'doctorsOnShift', 'criticalAlerts', 'avgWaitTime'] as const

export type DashboardMetricId = (typeof DASHBOARD_METRIC_IDS)[number]

export type DashboardMetricRow = {
  id: DashboardMetricId
  label: string
  value: string
}

export const DEFAULT_DASHBOARD_METRICS: Record<DashboardMetricId, Omit<DashboardMetricRow, 'id'>> =
  Object.fromEntries(
    (dashboardFixture.overviewMetrics as DashboardMetricRow[]).map((m) => [m.id, { label: m.label, value: m.value }]),
  ) as Record<DashboardMetricId, Omit<DashboardMetricRow, 'id'>>

export const DEFAULT_DASHBOARD_LAYOUT_ORDER: DashboardMetricId[] = (
  dashboardFixture.overviewMetrics as DashboardMetricRow[]
).map((m) => m.id)

export const DASHBOARD_METRIC_LABELS: Record<DashboardMetricId, string> = {
  activePatients: 'Total Patients',
  doctorsOnShift: 'Doctors On Shift',
  criticalAlerts: 'Critical Alerts',
  avgWaitTime: 'Avg. Wait Time',
}

export const PUCK_TYPE_BY_METRIC_ID: Record<DashboardMetricId, string> = {
  activePatients: 'DashboardOverviewActivePatients',
  doctorsOnShift: 'DashboardOverviewDoctorsOnShift',
  criticalAlerts: 'DashboardOverviewCriticalAlerts',
  avgWaitTime: 'DashboardOverviewAvgWaitTime',
}

export const METRIC_ID_BY_PUCK_TYPE: Record<string, DashboardMetricId> = Object.fromEntries(
  (Object.entries(PUCK_TYPE_BY_METRIC_ID) as [DashboardMetricId, string][]).map(([id, t]) => [t, id]),
) as Record<string, DashboardMetricId>

/** Overview metric `<article>` on Home dashboard and in the Puck customize canvas. */
export const DASHBOARD_METRIC_TILE_CLASSNAME =
  'min-h-0 min-w-0 w-full rounded-lg border border-violet-200/70 bg-white p-4 shadow-sm shadow-violet-200/20 dark:border-violet-500/20 dark:bg-slate-950 dark:shadow-violet-900/30'

/** Root wrapper for Puck `Render` and editor preview — matches Home dashboard grid. */
export const DASHBOARD_OVERVIEW_ROOT_CLASSNAME =
  ''

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

export function validateDashboardOverviewPayload(parsed: unknown): string | null {
  if (!isRecord(parsed)) return 'Expected an object root'
  const rootKeysAllowed = new Set(['metrics', 'layoutOrder', 'puckContent'])
  if (Object.keys(parsed).some((k) => !rootKeysAllowed.has(k))) return 'Unknown keys on root payload'
  if (!('metrics' in parsed) || !('layoutOrder' in parsed)) return 'Expected metrics and layoutOrder'
  if ('puckContent' in parsed && parsed.puckContent !== undefined) {
    if (!Array.isArray(parsed.puckContent)) return 'puckContent must be an array'
    if (parsed.puckContent.length > 0 && !parseStoredPuckContent(parsed.puckContent))
      return 'puckContent is not valid Puck canvas data'
  }
  const loRaw = parseLayoutOrderStrict(parsed.layoutOrder)
  if (typeof loRaw === 'string') return loRaw
  const m = parsed.metrics
  if (!isRecord(m)) return 'metrics must be an object'
  const rec: Partial<Record<DashboardMetricId, unknown>> = {}
  for (const id of DASHBOARD_METRIC_IDS) rec[id] = m[id]
  const err = validateDashboardMetricsRecord(rec)
  if (err) return err
  const keys = Object.keys(m)
  const allowed = new Set<string>([...DASHBOARD_METRIC_IDS])
  if (keys.some((k) => !allowed.has(k))) return 'metrics contains unknown keys'
  return null
}

export function parseDashboardOverviewPayload(
  parsed: unknown,
): DashboardOverviewStatePayload | null {
  if (validateDashboardOverviewPayload(parsed)) return null
  const p = parsed as Record<string, unknown>
  const layoutOrder = parseLayoutOrderStrict(p.layoutOrder) as DashboardMetricId[]
  const m = p.metrics as Record<DashboardMetricId, { label: string; value: string }>
  const metrics: DashboardOverviewStatePayload['metrics'] = { ...DEFAULT_DASHBOARD_METRICS }
  for (const id of DASHBOARD_METRIC_IDS) metrics[id] = m[id]
  const puckRaw = p.puckContent
  const puckContent =
    Array.isArray(puckRaw) && puckRaw.length > 0 ? parseStoredPuckContent(puckRaw) : undefined
  return { layoutOrder, metrics, ...(puckContent ? { puckContent } : {}) }
}

export function validateDashboardMetricsRecord(
  rec: Partial<Record<DashboardMetricId, unknown>>,
): string | null {
  for (const id of DASHBOARD_METRIC_IDS) {
    const row = rec[id]
    if (!isRecord(row)) return `metrics.${id}: expected object`
    const label = row.label as unknown
    const value = row.value as unknown
    if (typeof label !== 'string' || !label.trim()) return `metrics.${id}: label required`
    if (typeof value !== 'string') return `metrics.${id}: value required`
  }
  return null
}

export function normalizeLayoutOrder(raw: unknown): DashboardMetricId[] {
  const strict = parseLayoutOrderStrict(raw)
  return typeof strict === 'string' ? [...DEFAULT_DASHBOARD_LAYOUT_ORDER] : strict
}

/** Validates order for JSON recovery; rejects unknown IDs or duplicates instead of silently fixing. */
export function parseLayoutOrderStrict(raw: unknown): DashboardMetricId[] | string {
  if (!Array.isArray(raw) || raw.length === 0) return 'layoutOrder must be a non-empty array'
  const seen = new Set<DashboardMetricId>()
  const out: DashboardMetricId[] = []
  for (const x of raw) {
    if (typeof x !== 'string') return 'layoutOrder entries must be strings'
    const id = x as DashboardMetricId
    if (!DASHBOARD_METRIC_IDS.includes(id)) return `layoutOrder: unknown metric id "${id}"`
    if (seen.has(id)) return `layoutOrder: duplicate "${id}"`
    seen.add(id)
    out.push(id)
  }
  return out
}

export type DashboardOverviewStatePayload = {
  metrics: Record<DashboardMetricId, { label: string; value: string }>
  layoutOrder: DashboardMetricId[]
  /** Optional nested Puck tree (layout rows + tiles). */
  puckContent?: ComponentData[]
}

export function hydrateDashboardPuckMetrics(
  content: ComponentData[],
  metrics: Record<DashboardMetricId, { label: string; value: string }>,
): ComponentData[] {
  const next = shallowClonePuckContent(content)
  walkPuckContentPreorder(next, (node) => {
    const id = METRIC_ID_BY_PUCK_TYPE[node.type as string]
    if (!id) return
    const row = metrics[id]
    node.props = {
      ...(typeof node.props === 'object' && node.props !== null ? node.props : {}),
      id: `${PUCK_TYPE_BY_METRIC_ID[id]}:${id}`,
      label: row.label,
      value: row.value,
    }
  })
  return next
}

export function clearDashboardOverviewStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

/** Removes persisted overview + Puck customize draft keys, then callers typically `location.reload()`. */
export function clearAllDashboardCustomizationLocalStorage(): void {
  clearDashboardOverviewStorage()
  try {
    localStorage.removeItem(DASHBOARD_PUCK_DRAFT_LS_KEY)
  } catch {
    /* ignore */
  }
}

/** True when the Puck customize flow left a non-empty draft (same shape check as `DashboardCustomizePuckEditor`). */
export function hasDashboardPuckDraftInLocalStorage(): boolean {
  try {
    const raw = localStorage.getItem(DASHBOARD_PUCK_DRAFT_LS_KEY)
    if (!raw?.trim()) return false
    const parsed = JSON.parse(raw) as { content?: unknown }
    return Array.isArray(parsed.content) && parsed.content.length > 0
  } catch {
    return false
  }
}

export function persistDashboardOverviewState(payload: DashboardOverviewStatePayload): void {
  try {
    const stored = { v: 1 as const, ...payload }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
  } catch {
    /* ignore */
  }
}

export type LoadDashboardOverviewResult =
  | {
      ok: true
      metrics: Record<DashboardMetricId, { label: string; value: string }>
      layoutOrder: DashboardMetricId[]
      puckContent: ComponentData[] | undefined
      empty: boolean
    }
  | { ok: false; empty: boolean }

export function loadDashboardOverviewFromStorage(): LoadDashboardOverviewResult {
  let raw: string | null
  try {
    raw = localStorage.getItem(STORAGE_KEY)
  } catch {
    return { ok: false, empty: false }
  }
  if (!raw || !raw.trim()) {
    return {
      ok: true,
      metrics: { ...DEFAULT_DASHBOARD_METRICS },
      layoutOrder: [...DEFAULT_DASHBOARD_LAYOUT_ORDER],
      puckContent: undefined,
      empty: true,
    }
  }
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!isRecord(parsed) || parsed.v !== 1) throw new Error('bad version')
    const layoutOrder = normalizeLayoutOrder(parsed.layoutOrder)
    const m = parsed.metrics as unknown
    if (!isRecord(m)) throw new Error('metrics shape')
    const metrics: Partial<Record<DashboardMetricId, { label: string; value: string }>> = {}
    for (const id of DASHBOARD_METRIC_IDS) {
      const slice = m[id]
      if (!isRecord(slice)) throw new Error(`metrics.${id}`)
      const label = slice.label as unknown
      const value = slice.value as unknown
      if (typeof label !== 'string' || !label.trim()) throw new Error(`metrics.${id}.label`)
      if (typeof value !== 'string') throw new Error(`metrics.${id}.value`)
      metrics[id] = { label, value }
    }
    const shapeErr = validateDashboardMetricsRecord(metrics)
    if (shapeErr) throw new Error(shapeErr)
    const puckContent =
      Array.isArray(parsed.puckContent) && parsed.puckContent.length > 0
        ? parseStoredPuckContent(parsed.puckContent)
        : undefined
    return {
      ok: true,
      metrics: metrics as Record<DashboardMetricId, { label: string; value: string }>,
      layoutOrder,
      puckContent,
      empty: false,
    }
  } catch {
    clearDashboardOverviewStorage()
    return { ok: false, empty: false }
  }
}

export function buildDashboardPuckDataFromState(state: DashboardOverviewStatePayload): Data {
  const rawTree =
    state.puckContent && state.puckContent.length > 0
      ? shallowClonePuckContent(state.puckContent)
      : cloneBundledDefaultPuckContent()
  const hydrated = hydrateDashboardPuckMetrics(rawTree, state.metrics)
  return { content: hydrated, root: { props: {} }, zones: {} }
}

function walkPuckDataTrees(data: Data, visitor: (row: ComponentData) => void) {
  walkPuckContentPreorder(data.content ?? [], visitor)
  for (const z of Object.values(data.zones ?? {})) {
    if (Array.isArray(z)) walkPuckContentPreorder(z as ComponentData[], visitor)
  }
}

export function dashboardStateFromPuckData(
  data: Data,
  /** Keeps labels/values for tiles not placed on the canvas (same pattern as analytics data + Puck layout). */
  baselineMetrics: DashboardOverviewStatePayload['metrics'],
):
  | { ok: true; metrics: DashboardOverviewStatePayload['metrics']; layoutOrder: DashboardMetricId[] }
  | { ok: false; errors: string[] } {
  const errors: string[] = []
  const layoutOrder: DashboardMetricId[] = []
  const seen = new Set<DashboardMetricId>()
  const seenInstanceIds = new Set<string>()
  const nextMetrics: DashboardOverviewStatePayload['metrics'] = { ...baselineMetrics }

  walkPuckDataTrees(data, (row) => {
    const id = METRIC_ID_BY_PUCK_TYPE[row.type as string]
    if (!id) return
    const p = row.props as { id?: unknown; label?: unknown; value?: unknown }
    const instanceId = typeof p.id === 'string' ? p.id : ''
    if (instanceId && seenInstanceIds.has(instanceId)) return
    if (instanceId) seenInstanceIds.add(instanceId)
    if (seen.has(id)) {
      errors.push(`${id}: only one tile is allowed`)
      return
    }
    const label = typeof p.label === 'string' ? p.label.trim() : ''
    const value = typeof p.value === 'string' ? p.value.trim() : ''
    if (!label) {
      errors.push(`${id}: label is required`)
      return
    }
    if (!value) {
      errors.push(`${id}: value is required`)
      return
    }
    seen.add(id)
    layoutOrder.push(id)
    nextMetrics[id] = { label, value }
  })

  if (layoutOrder.length === 0) errors.push('Add at least one overview tile from the left panel.')
  if (errors.length > 0) return { ok: false, errors }
  return { ok: true, metrics: nextMetrics, layoutOrder }
}
