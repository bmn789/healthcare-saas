import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import financial from '../../../data/analytics-financial.json'
import { AnalyticsChartCard } from './AnalyticsChartCard'
import { analyticsTooltipContentStyle, useAnalyticsChartPalette } from '../charts/useAnalyticsChartPalette'

export type FinancialDatum = {
  month: string
  revenue: number
  expenses: number
}

export type RevenueComposedChartProps = {
  data?: FinancialDatum[]
  cardTitle: string
  cardDescription: string
}

export default function RevenueComposedChartCore({
  data = financial,
  cardTitle,
  cardDescription,
}: RevenueComposedChartProps) {
  const p = useAnalyticsChartPalette()
  const tooltip = analyticsTooltipContentStyle(p)
  const barCursor = p.isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(56, 189, 248, 0.08)'

  return (
    <AnalyticsChartCard title={cardTitle} description={cardDescription}>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid stroke={p.grid} strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fill: p.muted }} />
            <YAxis
              tick={{ fill: p.muted }}
              domain={[2.5, 'auto']}
              tickFormatter={(v) => `$${v}m`}
            />
            <Tooltip
              cursor={{ fill: barCursor }}
              contentStyle={tooltip}
              formatter={(value, name) => {
                const label = typeof name === 'string' ? name : 'Series'
                return [`$${Number(value ?? 0)}m`, label]
              }}
            />
            <Legend wrapperStyle={{ color: p.muted }} />
            <Bar dataKey="revenue" name="Revenue" fill={p.colors.violet} radius={[4, 4, 0, 0]} maxBarSize={36} />
            <Line type="monotone" dataKey="expenses" name="Expenses" stroke={p.colors.sky} strokeWidth={2.5} dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsChartCard>
  )
}
