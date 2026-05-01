import { AppointmentStackedChart } from '../components/analytics/charts/AppointmentStackedChart'
import { DemographicsDonutChart } from '../components/analytics/charts/DemographicsDonutChart'
import { DepartmentVolumeChart } from '../components/analytics/charts/DepartmentVolumeChart'
import { QualityTrendsChart } from '../components/analytics/charts/QualityTrendsChart'
import { RevenueComposedChart } from '../components/analytics/charts/RevenueComposedChart'
import { WaitTimeAreaChart } from '../components/analytics/charts/WaitTimeAreaChart'
import { WardRadarChart } from '../components/analytics/charts/WardRadarChart'
import { WeeklyThroughputChart } from '../components/analytics/charts/WeeklyThroughputChart'
import { DEFAULT_ANALYTICS_LAYOUT_ORDER, type AnalyticsChartId } from '../lib/analyticsChartConfig'

function AnalyticsChartById({ id }: { id: AnalyticsChartId }) {
  switch (id) {
    case 'weeklyThroughput':
      return <WeeklyThroughputChart />
    case 'departmentVolume':
      return <DepartmentVolumeChart />
    case 'demographics':
      return <DemographicsDonutChart />
    case 'waitTime':
      return <WaitTimeAreaChart />
    case 'revenue':
      return <RevenueComposedChart />
    case 'ward':
      return <WardRadarChart className="w-full min-w-0" />
    case 'appointments':
      return <AppointmentStackedChart />
    case 'quality':
      return <QualityTrendsChart />
    default: {
      const _exhaustive: never = id
      return _exhaustive
    }
  }
}

export const AnalyticsPage = () => {
  return (
    <section className="space-y-8 pb-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-violet-100">Analytics</h1>
        <p className="max-w-2xl text-sm text-violet-700/80 dark:text-violet-300/80">
          Operational, clinical, and financial signals derived from inpatient and ambulatory workflows. Use the sections
          below for capacity planning, access, and board-ready reporting.
        </p>
      </div>

      <div className="space-y-8">
        {DEFAULT_ANALYTICS_LAYOUT_ORDER.map((id) => (
          <AnalyticsChartById key={id} id={id} />
        ))}
      </div>
    </section>
  )
}
