import { AppointmentStackedChart } from '../analytics/charts/AppointmentStackedChart'
import { DemographicsDonutChart } from '../analytics/charts/DemographicsDonutChart'
import { DepartmentVolumeChart } from '../analytics/charts/DepartmentVolumeChart'
import { QualityTrendsChart } from '../analytics/charts/QualityTrendsChart'
import { RevenueComposedChart } from '../analytics/charts/RevenueComposedChart'
import { WaitTimeAreaChart } from '../analytics/charts/WaitTimeAreaChart'
import { WardRadarChart } from '../analytics/charts/WardRadarChart'
import { WeeklyThroughputChart } from '../analytics/charts/WeeklyThroughputChart'
import {
  ANALYTICS_CHART_IDS,
  ANALYTICS_CHART_LABELS,
  type AnalyticsChartId,
} from '../../lib/analyticsChartConfig'

/** Stable Puck type names for analytics charts (Home dashboard embed). */
export const ANALYTICS_PUCK_TYPE_BY_ID: Record<AnalyticsChartId, string> = {
  weeklyThroughput: 'DashboardAnalyticsWeeklyThroughput',
  departmentVolume: 'DashboardAnalyticsDepartmentVolume',
  demographics: 'DashboardAnalyticsDemographics',
  waitTime: 'DashboardAnalyticsWaitTime',
  revenue: 'DashboardAnalyticsRevenue',
  ward: 'DashboardAnalyticsWard',
  appointments: 'DashboardAnalyticsAppointments',
  quality: 'DashboardAnalyticsQuality',
}

export const ANALYTICS_PUCK_CATEGORY_ORDER = ANALYTICS_CHART_IDS.map((id) => ANALYTICS_PUCK_TYPE_BY_ID[id])

function AnalyticsChartEmbed({ id }: { id: AnalyticsChartId }) {
  const inner = (() => {
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
        const _x: never = id
        return _x
      }
    }
  })()

  return <div className="min-h-0 min-w-0 w-full">{inner}</div>
}

function makeAnalyticsChartBlock(chartId: AnalyticsChartId) {
  return {
    label: ANALYTICS_CHART_LABELS[chartId],
    fields: {},
    defaultProps: {},
    render: () => <AnalyticsChartEmbed id={chartId} />,
  }
}

export function dashboardAnalyticsChartComponents(): Record<string, ReturnType<typeof makeAnalyticsChartBlock>> {
  return Object.fromEntries(ANALYTICS_CHART_IDS.map((id) => [ANALYTICS_PUCK_TYPE_BY_ID[id], makeAnalyticsChartBlock(id)]))
}
