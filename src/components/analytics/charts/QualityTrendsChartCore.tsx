import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import quality from '../../../data/analytics-quality.json'
import { AnalyticsChartCard } from './AnalyticsChartCard'
import { analyticsTooltipContentStyle, useAnalyticsChartPalette } from '../charts/useAnalyticsChartPalette'

export type QualityDatum = {
  quarter: string
  readmissionPct: number
  hacRate: number
}

export type QualityTrendsChartProps = {
  data?: QualityDatum[]
  cardTitle: string
  cardDescription: string
}

export default function QualityTrendsChartCore({
  data = quality,
  cardTitle,
  cardDescription,
}: QualityTrendsChartProps) {
  const p = useAnalyticsChartPalette()
  const tooltip = analyticsTooltipContentStyle(p)

  return (
    <AnalyticsChartCard title={cardTitle} description={cardDescription}>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ right: 8 }}>
            <CartesianGrid stroke={p.grid} strokeDasharray="3 3" />
            <XAxis dataKey="quarter" tick={{ fill: p.muted }} />
            <YAxis
              yAxisId="left"
              tick={{ fill: p.muted }}
              tickFormatter={(v) => `${v}%`}
              domain={['dataMin - 1', 'dataMax + 1']}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: p.muted }}
              domain={['dataMin - 0.05', 'dataMax + 0.05']}
              tickFormatter={(v) => v.toFixed(2)}
            />
            <Tooltip
              contentStyle={tooltip}
              formatter={(value, name) => {
                const key = typeof name === 'string' ? name : ''
                const v = Number(value ?? 0)
                const isReadmission =
                  key === 'readmissionPct' || key === 'Readmissions' || key.includes('Readmission')
                return isReadmission
                  ? [`${v}%`, 'Readmissions']
                  : [`${v} / 1k`, 'HAC / 1k']
              }}
            />
            <Legend wrapperStyle={{ color: p.muted }} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="readmissionPct"
              name="Readmissions"
              stroke={p.colors.violet}
              strokeWidth={2.5}
              dot={{ r: 4 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="hacRate"
              name="HAC / 1k"
              stroke={p.colors.sky}
              strokeWidth={2.5}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsChartCard>
  )
}
