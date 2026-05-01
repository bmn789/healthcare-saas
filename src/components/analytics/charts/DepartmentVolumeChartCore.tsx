import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import deptData from '../../../data/analytics-departments.json'
import { AnalyticsChartCard } from './AnalyticsChartCard'
import { analyticsTooltipContentStyle, useAnalyticsChartPalette } from '../charts/useAnalyticsChartPalette'

export type DepartmentDatum = {
  department: string
  cases: number
}

export type DepartmentVolumeChartProps = {
  data?: DepartmentDatum[]
  cardTitle: string
  cardDescription: string
}

export default function DepartmentVolumeChartCore({
  data = deptData,
  cardTitle,
  cardDescription,
}: DepartmentVolumeChartProps) {
  const p = useAnalyticsChartPalette()
  const tooltip = analyticsTooltipContentStyle(p)
  const cursorFill = p.isDark ? 'rgba(139, 92, 246, 0.14)' : 'rgba(139, 92, 246, 0.08)'

  return (
    <AnalyticsChartCard title={cardTitle} description={cardDescription} className="min-h-[22rem]">
      <div className="h-72 w-full lg:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={data} margin={{ left: 8, right: 16 }}>
            <CartesianGrid stroke={p.grid} strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tick={{ fill: p.muted }} />
            <YAxis
              type="category"
              dataKey="department"
              width={92}
              tick={{ fill: p.muted, fontSize: 12 }}
            />
            <Tooltip cursor={{ fill: cursorFill }} contentStyle={tooltip} />
            <Bar dataKey="cases" fill={p.colors.violet} radius={[0, 4, 4, 0]} maxBarSize={22} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsChartCard>
  )
}
