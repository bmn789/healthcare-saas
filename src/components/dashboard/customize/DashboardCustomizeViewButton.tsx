import { LayoutGrid, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  clearAllDashboardCustomizationLocalStorage,
  hasDashboardPuckDraftInLocalStorage,
} from '../../../lib/dashboardOverviewStorage'
import { useDashboardOverviewStore } from '../../../store/dashboardOverviewStore'

type DashboardCustomizeViewButtonProps = {
  className?: string
}

const btnClass =
  'inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-violet-200/80 bg-white px-3 py-2 text-sm font-medium text-violet-900 outline-none ring-violet-400/35 transition hover:bg-violet-50 focus-visible:ring-2 dark:border-violet-500/30 dark:bg-slate-900 dark:text-violet-100 dark:ring-violet-500/35 dark:hover:bg-violet-500/15'

const resetBtnClass =
  'inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none ring-slate-400/30 transition hover:bg-slate-50 focus-visible:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-500/35 dark:hover:bg-slate-800/70'

export const DashboardCustomizeViewButton = ({
  className = '',
}: DashboardCustomizeViewButtonProps) => {
  return (
    <Link
      to="/dashboard/customization"
      className={[btnClass, className].filter(Boolean).join(' ')}
      aria-label="Customize Home dashboard view"
    >
      <LayoutGrid size={14} aria-hidden />
      Customize view
    </Link>
  )
}

type DashboardCustomizeViewActionsProps = {
  className?: string
}

/** Home dashboard toolbar: Reset clears overview + Puck draft and reloads. Shown when there is persisted overview or a draft (no persisted apply yet). */
export function DashboardCustomizeViewActions({ className = '' }: DashboardCustomizeViewActionsProps) {
  const hasSavedDashboardOverview = useDashboardOverviewStore((s) => s.hasSavedDashboardOverview)
  const showReset = hasSavedDashboardOverview || hasDashboardPuckDraftInLocalStorage()

  return (
    <div className={['flex flex-wrap items-center justify-end gap-2', className].filter(Boolean).join(' ')}>
      <DashboardCustomizeViewButton />
      {showReset ? (
        <button
          type="button"
          className={resetBtnClass}
          aria-label="Reset Home dashboard customization and reload"
          onClick={() => {
            clearAllDashboardCustomizationLocalStorage()
            window.location.reload()
          }}
        >
          <RotateCcw size={14} aria-hidden />
          Reset
        </button>
      ) : null}
    </div>
  )
}
