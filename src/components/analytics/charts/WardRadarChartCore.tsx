import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import wards from '../../../data/analytics-wards.json'
import { AnalyticsChartCard } from './AnalyticsChartCard'
import { analyticsTooltipContentStyle, useAnalyticsChartPalette } from '../charts/useAnalyticsChartPalette'

export type WardDatum = {
  ward: string
  occupancy: number
  throughput: number
  satisfaction: number
}

export type WardRadarChartProps = {
  data?: WardDatum[]
  className?: string
  cardTitle: string
  cardDescription: string
}

export default function WardRadarChartCore({
  data = wards,
  className,
  cardTitle,
  cardDescription,
}: WardRadarChartProps) {
  const p = useAnalyticsChartPalette()
  const tooltip = analyticsTooltipContentStyle(p)

  return (
    <AnalyticsChartCard
      title={cardTitle}
      description={cardDescription}
      className={className ? `lg:min-h-[28rem] ${className}` : 'lg:min-h-[28rem]'}
    >
      <div className="h-72 min-h-[16rem] w-full lg:h-[24rem]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="52%" outerRadius="72%" data={data}>
            <PolarGrid stroke={p.grid} />
            <PolarAngleAxis dataKey="ward" tick={{ fill: p.muted, fontSize: 11 }} />
            <Radar
              name="Occupancy"
              dataKey="occupancy"
              stroke={p.colors.violet}
              fill={p.colors.violet}
              fillOpacity={0.22}
              strokeWidth={2}
            />
            <Radar
              name="Throughput"
              dataKey="throughput"
              stroke={p.colors.sky}
              fill={p.colors.sky}
              fillOpacity={0.14}
              strokeWidth={2}
            />
            <Radar
              name="Satisfaction"
              dataKey="satisfaction"
              stroke={p.colors.emerald}
              fill={p.colors.emerald}
              fillOpacity={0.12}
              strokeWidth={2}
            />
            <Legend
              wrapperStyle={{ color: p.muted, fontSize: 11 }}
              iconType="circle"
            />
            <Tooltip contentStyle={tooltip} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsChartCard>
  )
}
