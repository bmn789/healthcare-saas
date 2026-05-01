import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import appointments from '../../../data/analytics-appointments.json'
import { AnalyticsChartCard } from './AnalyticsChartCard'
import { analyticsTooltipContentStyle, useAnalyticsChartPalette } from '../charts/useAnalyticsChartPalette'

export type AppointmentDatum = {
  day: string
  completed: number
  rescheduled: number
  noShow: number
}

export type AppointmentStackedChartProps = {
  data?: AppointmentDatum[]
  cardTitle: string
  cardDescription: string
}

export default function AppointmentStackedChartCore({
  data = appointments,
  cardTitle,
  cardDescription,
}: AppointmentStackedChartProps) {
  const p = useAnalyticsChartPalette()
  const tooltip = analyticsTooltipContentStyle(p)
  const cursorFill = p.isDark ? 'rgba(129, 140, 248, 0.12)' : 'rgba(129, 140, 248, 0.06)'

  return (
    <AnalyticsChartCard title={cardTitle} description={cardDescription}>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke={p.grid} strokeDasharray="3 3" />
            <XAxis dataKey="day" tick={{ fill: p.muted }} />
            <YAxis tick={{ fill: p.muted }} />
            <Tooltip cursor={{ fill: cursorFill }} contentStyle={tooltip} />
            <Legend wrapperStyle={{ color: p.muted }} />
            <Bar dataKey="completed" name="Completed" stackId="a" fill={p.colors.emerald} radius={[0, 0, 0, 0]} maxBarSize={44} />
            <Bar dataKey="rescheduled" name="Rescheduled" stackId="a" fill={p.colors.amber} maxBarSize={44} />
            <Bar dataKey="noShow" name="No-show" stackId="a" fill={p.colors.rose} radius={[4, 4, 0, 0]} maxBarSize={44} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsChartCard>
  )
}
