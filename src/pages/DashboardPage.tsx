import { DashboardPuckRender } from '../components/dashboard/DashboardPuckRender'
import { DashboardCustomizeViewActions } from '../components/dashboard/customize/DashboardCustomizeViewButton'
import { useDashboardOverviewStore } from '../store/dashboardOverviewStore'

export const DashboardPage = () => {
  const hadStorageCorruption = useDashboardOverviewStore((s) => s.hadStorageCorruption)
  const dismissCorruptionBanner = useDashboardOverviewStore((s) => s.dismissCorruptionBanner)
  const layoutOrder = useDashboardOverviewStore((s) => s.layoutOrder)
  const metrics = useDashboardOverviewStore((s) => s.metrics)
  const puckContent = useDashboardOverviewStore((s) => s.puckContent)

  return (
    <section className="space-y-6">
      {hadStorageCorruption ? (
        <div
          className="flex flex-col gap-2 rounded-xl border border-amber-200/90 bg-amber-50 px-4 py-3 text-sm text-amber-950 shadow-sm dark:border-amber-500/35 dark:bg-amber-950/45 dark:text-amber-50 sm:flex-row sm:items-center sm:justify-between"
          role="alert"
        >
          <p className="min-w-0">
            Saved Home dashboard customization could not be read and was cleared. Showing default tiles from bundled
            fixtures. Customize view uses a JSON editor until you apply valid data; the visual editor returns after
            that.
          </p>
          <button
            type="button"
            onClick={() => dismissCorruptionBanner()}
            className="shrink-0 rounded-lg border border-amber-300/90 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100 dark:border-amber-500/40 dark:bg-amber-900/80 dark:text-amber-100 dark:hover:bg-amber-800/70"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-violet-100">Home Dashboard</h1>
        </div>
        <DashboardCustomizeViewActions />
      </div>

      <DashboardPuckRender metrics={metrics} layoutOrder={layoutOrder} puckContent={puckContent} />
    </section>
  )
}
