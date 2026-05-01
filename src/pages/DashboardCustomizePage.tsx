import { ArrowLeft } from 'lucide-react'
import { Suspense, lazy } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDashboardOverviewStore } from '../store/dashboardOverviewStore'

const DashboardCustomizePuckEditorLazy = lazy(() =>
  import('../components/puck-editor/DashboardCustomizePuckEditor').then((m) => ({
    default: m.DashboardCustomizePuckEditor,
  })),
)

export const DashboardCustomizePage = () => {
  const navigate = useNavigate()
  const puckCustomizeUiEnabled = useDashboardOverviewStore((s) => s.puckCustomizeUiEnabled)

  const goDashboard = () => {
    navigate('/dashboard/view')
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-6 pb-10">
      <div className="space-y-3">
        <Link
          to="/dashboard/view"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-800 underline-offset-4 hover:text-violet-950 hover:underline dark:text-violet-300 dark:hover:text-violet-100"
        >
          <ArrowLeft size={16} aria-hidden />
          Back to Home dashboard
        </Link>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-violet-100">Customize Home dashboard</h1>
          {puckCustomizeUiEnabled ? (
            <p className="max-w-3xl text-sm text-violet-700/80 dark:text-violet-300/80">
              Arrange layout rows, spacing, overview tiles, tagged cards, and Analytics charts — same visuals and data
              as the Analytics page. Card copy defaults ship from{' '}
              <code className="text-xs">src/data/dashboard-cards.json</code>.
            </p>
          ) : (
            <p className="max-w-3xl text-sm text-violet-700/80 dark:text-violet-300/80">
              Stored customization could not be read — edit JSON until it validates, then apply. Afterwards the visual
              editor becomes available again. Root shape: layoutOrder plus metrics keyed by dashboard metric IDs.
            </p>
          )}
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex min-h-[min(70vh,720px)] items-center justify-center rounded-xl border border-violet-200/70 bg-violet-50/40 text-sm text-violet-700 dark:border-violet-500/25 dark:bg-slate-950/50 dark:text-violet-300">
            Loading editor…
          </div>
        }
      >
        <DashboardCustomizePuckEditorLazy onApplied={goDashboard} onCancel={goDashboard} />
      </Suspense>
    </section>
  )
}
