import { Button, Puck, useGetPuck } from '@puckeditor/core'
import type { Data } from '@puckeditor/core'
import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { buildDashboardPuckDataFromState } from '../../lib/dashboardOverviewStorage'
import { useDashboardOverviewStore } from '../../store/dashboardOverviewStore'
import { dashboardPuckConfig } from './dashboardPuckConfig'

import './puck-editor-theme.css'
import '@puckeditor/core/puck.css'

function DashboardCustomizeHeaderActions({
  onCancel,
  onApplyFromData,
}: {
  onCancel: () => void
  onApplyFromData: (data: Data) => void
}) {
  const getPuck = useGetPuck()
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Button variant="secondary" type="button" onClick={onCancel}>
        Cancel
      </Button>
      <Button
        variant="primary"
        type="button"
        onClick={() => onApplyFromData(getPuck().appState.data)}
      >
        Apply to dashboard
      </Button>
    </div>
  )
}

export type DashboardCustomizePuckEditorProps = {
  onApplied: () => void
  onCancel: () => void
}

export function DashboardCustomizePuckEditor({ onApplied, onCancel }: DashboardCustomizePuckEditorProps) {
  const [puckDraft, setPuckDraft] = useState<Data>(() => {
    try {
      const raw = localStorage.getItem('dashboard-puck-data')
      if (raw?.trim()) {
        const parsed = JSON.parse(raw) as Partial<Data>
        if (Array.isArray(parsed.content) && parsed.content.length > 0) {
          return {
            content: parsed.content,
            root: parsed.root ?? { props: {} },
            zones: parsed.zones ?? {},
          }
        }
      }
    } catch {
      /* fall through */
    }
    const { metrics, layoutOrder, puckContent } = useDashboardOverviewStore.getState()
    return buildDashboardPuckDataFromState({
      metrics,
      layoutOrder,
      ...(puckContent?.length ? { puckContent } : {}),
    })
  })
  const [applyError, setApplyError] = useState<string | null>(null)

  useEffect(() => {
    setApplyError(null)
  }, [])

  const handleApplyFromData = useCallback(
    (data: Data) => {
      try {
        localStorage.setItem('dashboard-puck-data', JSON.stringify(data))
      } catch {
        /* ignore */
      }
      onApplied()
    },
    [onApplied],
  )

  const overrides = useMemo(
    () => ({
      headerActions: (_props: { children: ReactNode }) => (
        <DashboardCustomizeHeaderActions onCancel={onCancel} onApplyFromData={handleApplyFromData} />
      ),
    }),
    [onCancel, handleApplyFromData])

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-violet-200/70 bg-violet-50/40 shadow-sm dark:border-violet-500/25 dark:bg-slate-950/50">
        <div className="analytics-puck-scope flex min-h-[min(70vh,720px)] w-full min-w-0 flex-1 flex-col">
          <Puck
            config={dashboardPuckConfig}
            data={puckDraft}
            onChange={setPuckDraft}
            overrides={overrides}
            iframe={{ enabled: false }}
          />
        </div>
      </div>

      {applyError ? (
        <p
          className="rounded-lg border border-amber-200/80 bg-amber-50/90 px-4 py-2 text-xs text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-100"
          role="alert"
        >
          {applyError}
        </p>
      ) : null}
    </>
  )
}
