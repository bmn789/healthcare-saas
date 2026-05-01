import { useEffect, useState } from 'react'
import {
  DEFAULT_DASHBOARD_LAYOUT_ORDER,
  DEFAULT_DASHBOARD_METRICS,
  parseDashboardOverviewPayload,
  validateDashboardOverviewPayload,
} from '../../../lib/dashboardOverviewStorage'
import { useDashboardOverviewStore } from '../../../store/dashboardOverviewStore'

const footerBtnBase =
  'inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium outline-none ring-violet-400/35 transition focus-visible:ring-2 dark:ring-violet-500/35'

const textareaClass =
  'min-h-[min(48vh,420px)] w-full rounded-lg border border-violet-200/80 bg-white p-3 font-mono text-xs leading-relaxed text-slate-900 outline-none ring-violet-400/30 focus:border-violet-400 focus:ring-2 dark:border-violet-500/30 dark:bg-slate-900 dark:text-violet-100 dark:focus:border-violet-400'

function snapshotDraft(): string {
  const { metrics, layoutOrder, puckContent } = useDashboardOverviewStore.getState()
  return JSON.stringify(
    {
      layoutOrder,
      metrics,
      ...(Array.isArray(puckContent) && puckContent.length > 0 ? { puckContent } : {}),
    },
    null,
    2,
  )
}

export type DashboardCustomizeJsonEditorProps = {
  onApplied: () => void
  onCancel: () => void
}

export function DashboardCustomizeJsonEditor({ onApplied, onCancel }: DashboardCustomizeJsonEditorProps) {
  const applyDashboardOverview = useDashboardOverviewStore((s) => s.applyDashboardOverview)
  const resetToBundledDefaults = useDashboardOverviewStore((s) => s.resetToBundledDefaults)

  const [draft, setDraft] = useState(() => snapshotDraft())
  const [applyError, setApplyError] = useState<string | null>(null)

  useEffect(() => {
    setDraft(snapshotDraft())
    setApplyError(null)
  }, [])

  const handleApply = () => {
    let parsed: unknown
    try {
      parsed = JSON.parse(draft)
    } catch {
      setApplyError('Invalid JSON')
      return
    }

    const err = validateDashboardOverviewPayload(parsed)
    if (err) {
      setApplyError(err)
      return
    }

    const payload = parseDashboardOverviewPayload(parsed)
    if (!payload) {
      setApplyError('Unexpected validation mismatch')
      return
    }

    setApplyError(null)
    applyDashboardOverview(payload)
    onApplied()
  }

  const handleResetUiDefaults = () => {
    resetToBundledDefaults()
    setDraft(
      JSON.stringify(
        {
          layoutOrder: [...DEFAULT_DASHBOARD_LAYOUT_ORDER],
          metrics: { ...DEFAULT_DASHBOARD_METRICS },
        },
        null,
        2,
      ),
    )
    setApplyError(null)
  }

  return (
    <>
      <div className="space-y-2 rounded-xl border border-violet-200/70 bg-white/80 px-4 py-4 shadow-sm dark:border-violet-500/25 dark:bg-slate-900/80">
        <label htmlFor="dashboard-overview-json-draft" className="text-xs font-semibold text-violet-900 dark:text-violet-100">
          layoutOrder + metrics
        </label>
        <textarea
          id="dashboard-overview-json-draft"
          spellCheck={false}
          autoComplete="off"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className={textareaClass}
        />
      </div>

      {applyError ? (
        <p
          className="rounded-lg border border-amber-200/80 bg-amber-50/90 px-4 py-2 text-xs text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-100"
          role="alert"
        >
          {applyError}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-violet-200/70 pt-4 dark:border-violet-500/25">
        <button
          type="button"
          className={`${footerBtnBase} border-violet-200/80 bg-white text-violet-900 hover:bg-violet-50 dark:border-violet-500/30 dark:bg-slate-900 dark:text-violet-100 dark:hover:bg-violet-500/15`}
          onClick={handleResetUiDefaults}
        >
          Reset to bundled defaults
        </button>
        <button
          type="button"
          className={`${footerBtnBase} border-violet-200/80 bg-white text-violet-900 hover:bg-violet-50 dark:border-violet-500/30 dark:bg-slate-900 dark:text-violet-100 dark:hover:bg-violet-500/15`}
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className={`${footerBtnBase} border-violet-600 bg-violet-600 text-white hover:bg-violet-700 dark:border-violet-500 dark:bg-violet-600 dark:hover:bg-violet-500`}
          onClick={handleApply}
        >
          Apply to dashboard
        </button>
      </div>
    </>
  )
}
