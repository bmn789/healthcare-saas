import { ANALYTICS_CHART_SCRIM } from '../../ui/DeferredVisible'

export const MIN_ANALYTICS_REVEAL_MS = 300

export function analyticsChartScrimsPlaceholder(heights: string) {
  const surface = `animate-pulse ${ANALYTICS_CHART_SCRIM} ${heights}`
  return (
    <div aria-busy className={surface} role="status">
      <span className="sr-only">Loading chart…</span>
    </div>
  )
}
