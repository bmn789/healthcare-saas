import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import waitData from '../../../data/analytics-wait-times.json'
import { AnalyticsChartCard } from './AnalyticsChartCard'
import { analyticsTooltipContentStyle, useAnalyticsChartPalette } from './useAnalyticsChartPalette'

export type WaitTimeDatum = {
  week: string
  er: number
  clinic: number
  imaging: number
}

export type WaitTimeAreaChartProps = {
  data?: WaitTimeDatum[]
  cardTitle: string
  cardDescription: string
}

export default function WaitTimeAreaChartCore({
  data = waitData,
  cardTitle,
  cardDescription,
}: WaitTimeAreaChartProps) {
  const p = useAnalyticsChartPalette()
  const tooltip = analyticsTooltipContentStyle(p)

  return (
    <AnalyticsChartCard title={cardTitle} description={cardDescription}>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8 }}>
            <defs>
              <linearGradient id="wtEr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={p.colors.violet} stopOpacity={0.35} />
                <stop offset="95%" stopColor={p.colors.violet} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="wtClinic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={p.colors.sky} stopOpacity={0.35} />
                <stop offset="95%" stopColor={p.colors.sky} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="wtImg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={p.colors.emerald} stopOpacity={0.35} />
                <stop offset="95%" stopColor={p.colors.emerald} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={p.grid} strokeDasharray="3 3" />
            <XAxis dataKey="week" tick={{ fill: p.muted }} />
            <YAxis tick={{ fill: p.muted }} label={{ value: 'min', position: 'insideLeft', fill: p.muted, fontSize: 11 }} />
            <Legend wrapperStyle={{ color: p.muted }} />
            <Tooltip
              contentStyle={tooltip}
              formatter={(value) => [`${Number(value ?? 0)} min`, '']}
            />
            <Area
              type="monotone"
              dataKey="er"
              name="Emergency"
              stroke={p.colors.violet}
              fillOpacity={1}
              fill="url(#wtEr)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="clinic"
              name="Outpatient"
              stroke={p.colors.sky}
              fillOpacity={1}
              fill="url(#wtClinic)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="imaging"
              name="Imaging"
              stroke={p.colors.emerald}
              fillOpacity={1}
              fill="url(#wtImg)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsChartCard>
  )
}
