import { useThemeStore } from '../../../store/themeStore'

export function useAnalyticsChartPalette() {
  const isDark = useThemeStore((s) => s.resolved === 'dark')
  return {
    isDark,
    muted: isDark ? '#c4b5fd' : '#6d28d9',
    grid: isDark ? '#312e81' : '#ddd6fe',
    tooltipBg: isDark ? '#0f172a' : '#faf5ff',
    tooltipBorder: isDark ? '#4c1d95' : '#e9d5ff',
    tooltipLabel: isDark ? '#ede9fe' : '#4c1d95',
    colors: {
      violet: '#8b5cf6',
      sky: '#38bdf8',
      emerald: '#34d399',
      amber: '#fbbf24',
      rose: '#fb7185',
      indigo: '#818cf8',
    },
  }
}

export function analyticsTooltipContentStyle(p: ReturnType<typeof useAnalyticsChartPalette>) {
  return {
    backgroundColor: p.tooltipBg,
    borderColor: p.tooltipBorder,
    borderRadius: '0.5rem',
    color: p.tooltipLabel,
    borderWidth: 1,
    borderStyle: 'solid' as const,
    boxShadow:
      '0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(139 92 246 / 0.12)',
  }
}
