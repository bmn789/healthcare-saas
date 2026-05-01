import trendData from '../../../data/analytics-trends.json'
import { TrendSeriesChart } from '../../ui/TrendSeriesChart'
import { AnalyticsChartCard } from './AnalyticsChartCard'

export type WeeklyThroughputChartCoreProps = {
  data?: typeof trendData
  cardTitle: string
  cardDescription: string
  throughputDisplay: 'line' | 'column'
}

export default function WeeklyThroughputChartCore({
  data = trendData,
  cardTitle,
  cardDescription,
  throughputDisplay,
}: WeeklyThroughputChartCoreProps) {
  return (
    <AnalyticsChartCard title={cardTitle} description={cardDescription} className="overflow-hidden">
      <TrendSeriesChart
        key={throughputDisplay}
        data={data}
        initialDisplay={throughputDisplay}
        className="border-0 bg-transparent p-0 shadow-none dark:bg-transparent dark:shadow-none"
      />
    </AnalyticsChartCard>
  )
}
