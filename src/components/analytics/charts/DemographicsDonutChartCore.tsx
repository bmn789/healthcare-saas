import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import demographics from '../../../data/analytics-demographics.json'
import { AnalyticsChartCard } from './AnalyticsChartCard'
import { analyticsTooltipContentStyle, useAnalyticsChartPalette } from '../charts/useAnalyticsChartPalette'

export type DemographicDatum = {
  segment: string
  patients: number
}

export type DemographicsDonutChartProps = {
  data?: DemographicDatum[]
  cardTitle: string
  cardDescription: string
}

export default function DemographicsDonutChartCore({
  data = demographics,
  cardTitle,
  cardDescription,
}: DemographicsDonutChartProps) {
  const p = useAnalyticsChartPalette()
  const tooltip = analyticsTooltipContentStyle(p)
  const keys = ['violet', 'sky', 'emerald', 'amber'] as const

  return (
    <AnalyticsChartCard title={cardTitle} description={cardDescription} className="min-h-[22rem]">
      <div className="h-72 w-full lg:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="patients"
              nameKey="segment"
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={92}
              paddingAngle={2}
            >
              {data.map((datum, i) => (
                <Cell key={datum.segment} fill={p.colors[keys[i % keys.length]!]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltip}
              formatter={(value) => [
                `${Number(value ?? 0).toLocaleString()}`,
                'Patients',
              ]}
            />
            <Legend
              verticalAlign="bottom"
              wrapperStyle={{ color: p.muted, fontSize: 12, paddingTop: 8 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsChartCard>
  )
}
