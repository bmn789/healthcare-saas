import * as Select from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { useId, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useThemeStore } from '../../store/themeStore'

export type TrendSeriesDatum = {
  name: string
  admissions: number
  discharges: number
}

export type TrendSeriesChartProps = {
  data: TrendSeriesDatum[]
  className?: string
  /** Initial Line vs Column view; parent should remount when this changes externally (e.g. `key`). */
  initialDisplay?: 'line' | 'column'
}

const ADMISSIONS_COLOR = '#8b5cf6'
const DISCHARGES_COLOR = '#38bdf8'

const CHART_TYPE_OPTIONS = [
  { value: 'line', label: 'Line' },
  { value: 'column', label: 'Column' },
] as const

const selectTriggerStyles =
  'inline-flex min-h-9 min-w-[9rem] items-center justify-between gap-2 rounded-lg border border-violet-200/80 bg-white px-3 py-2 text-left text-sm text-slate-800 outline-none ring-violet-400/30 transition hover:bg-violet-50 focus:ring-2 data-[state=open]:ring-2 dark:border-violet-500/30 dark:bg-slate-950 dark:text-violet-100 dark:hover:bg-slate-900 dark:focus:ring-violet-400 [&>span:first-child]:min-w-0 [&>span:first-child]:truncate'

const selectContentStyles =
  'z-[80] max-h-[min(20rem,var(--radix-select-content-available-height))] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-violet-200/70 bg-white py-1 shadow-lg shadow-violet-200/30 dark:border-violet-500/30 dark:bg-slate-950 dark:shadow-violet-950/50'

const selectItemStyles =
  'relative flex cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-3 text-sm text-slate-800 outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-violet-50 data-[highlighted]:text-violet-900 dark:text-violet-100 dark:data-[highlighted]:bg-violet-500/15 dark:data-[highlighted]:text-violet-50'

export function TrendSeriesChart({ data, className, initialDisplay = 'line' }: TrendSeriesChartProps) {
  const chartTypeLabelId = useId()
  const [variant, setVariant] = useState<'line' | 'column'>(initialDisplay)
  const isDark = useThemeStore((s) => s.resolved === 'dark')
  const muted = isDark ? '#c4b5fd' : '#6d28d9'
  const grid = isDark ? '#312e81' : '#ddd6fe'
  const tooltipBg = isDark ? '#0f172a' : '#faf5ff'
  const tooltipBorder = isDark ? '#4c1d95' : '#e9d5ff'
  const tooltipLabel = isDark ? '#ede9fe' : '#4c1d95'
  const tooltipContentStyle = {
    backgroundColor: tooltipBg,
    borderColor: tooltipBorder,
    borderRadius: '0.5rem',
    color: tooltipLabel,
    boxShadow:
      '0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(139 92 246 / 0.12)',
  }

  /** BarBand hover overlay (defaults read as harsh white band in light mode). */
  const barTooltipCursorFill = isDark ? 'rgba(139, 92, 246, 0.16)' : 'rgba(139, 92, 246, 0.1)'

  const axesAndLegend = (
    <>
      <CartesianGrid stroke={grid} strokeDasharray="3 3" />
      <XAxis dataKey="name" tick={{ fill: muted }} />
      <YAxis tick={{ fill: muted }} />
      <Legend wrapperStyle={{ color: muted }} />
    </>
  )

  return (
    <div
      className={
        className ??
        'rounded-lg border border-violet-200/70 bg-white p-4 shadow-sm shadow-violet-200/20 dark:border-violet-500/20 dark:bg-slate-950 dark:shadow-violet-900/30'
      }
    >
      <Select.Root
        value={variant}
        onValueChange={(v) => setVariant(v as 'line' | 'column')}
      >
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span
            id={chartTypeLabelId}
            className="text-xs font-medium text-violet-700 dark:text-violet-300/90"
          >
            Chart type
          </span>
          <Select.Trigger className={selectTriggerStyles} aria-labelledby={chartTypeLabelId}>
            <Select.Value />
            <Select.Icon aria-hidden>
              <ChevronDown size={16} className="shrink-0 text-violet-600 opacity-80 dark:text-violet-400" />
            </Select.Icon>
          </Select.Trigger>
        </div>
        <Select.Portal>
          <Select.Content
            position="popper"
            sideOffset={6}
            collisionPadding={8}
            className={selectContentStyles}
          >
            <Select.Viewport className="p-1">
              {CHART_TYPE_OPTIONS.map((opt) => (
                <Select.Item key={opt.value} value={opt.value} className={selectItemStyles}>
                  <Select.ItemIndicator className="absolute left-2 inline-flex items-center justify-center">
                    <Check size={14} className="text-violet-600 dark:text-violet-400" strokeWidth={2.5} />
                  </Select.ItemIndicator>
                  <Select.ItemText>{opt.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {variant === 'line' ? (
            <LineChart data={data}>
              {axesAndLegend}
              <Tooltip contentStyle={tooltipContentStyle} />
              <Line type="monotone" dataKey="admissions" stroke={ADMISSIONS_COLOR} strokeWidth={2} />
              <Line type="monotone" dataKey="discharges" stroke={DISCHARGES_COLOR} strokeWidth={2} />
            </LineChart>
          ) : (
            <BarChart data={data}>
              {axesAndLegend}
              <Tooltip cursor={{ fill: barTooltipCursorFill }} contentStyle={tooltipContentStyle} />
              <Bar dataKey="admissions" fill={ADMISSIONS_COLOR} radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="discharges" fill={DISCHARGES_COLOR} radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
