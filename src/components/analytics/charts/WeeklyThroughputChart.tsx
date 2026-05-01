import { lazy } from 'react'
import { DEFAULT_ANALYTICS_BUNDLE, resolveChartAppearance } from '../../../lib/analyticsChartConfig'
import { DeferredVisible } from '../../ui/DeferredVisible'
import { analyticsChartScrimsPlaceholder, MIN_ANALYTICS_REVEAL_MS } from './analyticsDeferredWrap'

const Core = lazy(() => import('./WeeklyThroughputChartCore'))

export function WeeklyThroughputChart() {
  const data = DEFAULT_ANALYTICS_BUNDLE.weeklyThroughput
  const appearance = resolveChartAppearance('weeklyThroughput')
  return (
    <DeferredVisible
      placeholder={analyticsChartScrimsPlaceholder('min-h-[22rem]')}
      rootMargin="160px 0px"
      minRevealAfterLoadMs={MIN_ANALYTICS_REVEAL_MS}
    >
      <Core
        data={data}
        cardTitle={appearance.cardTitle}
        cardDescription={appearance.cardDescription}
        throughputDisplay={appearance.throughputDisplay}
      />
    </DeferredVisible>
  )
}
