import { lazy } from 'react'
import { DEFAULT_ANALYTICS_BUNDLE, resolveChartAppearance } from '../../../lib/analyticsChartConfig'
import { DeferredVisible } from '../../ui/DeferredVisible'
import { analyticsChartScrimsPlaceholder, MIN_ANALYTICS_REVEAL_MS } from './analyticsDeferredWrap'

const Core = lazy(() => import('./QualityTrendsChartCore'))

export type { QualityDatum, QualityTrendsChartProps } from './QualityTrendsChartCore'

export function QualityTrendsChart() {
  const data = DEFAULT_ANALYTICS_BUNDLE.quality
  const appearance = resolveChartAppearance('quality')
  return (
    <DeferredVisible
      placeholder={analyticsChartScrimsPlaceholder('min-h-[20rem]')}
      rootMargin="140px 0px"
      minRevealAfterLoadMs={MIN_ANALYTICS_REVEAL_MS}
    >
      <Core
        data={data}
        cardTitle={appearance.cardTitle}
        cardDescription={appearance.cardDescription}
      />
    </DeferredVisible>
  )
}
