import { lazy } from 'react'
import { DEFAULT_ANALYTICS_BUNDLE, resolveChartAppearance } from '../../../lib/analyticsChartConfig'
import { DeferredVisible } from '../../ui/DeferredVisible'
import { analyticsChartScrimsPlaceholder, MIN_ANALYTICS_REVEAL_MS } from './analyticsDeferredWrap'

const Core = lazy(() => import('./DemographicsDonutChartCore'))

export type { DemographicDatum, DemographicsDonutChartProps } from './DemographicsDonutChartCore'

export function DemographicsDonutChart() {
  const data = DEFAULT_ANALYTICS_BUNDLE.demographics
  const appearance = resolveChartAppearance('demographics')
  return (
    <DeferredVisible
      placeholder={analyticsChartScrimsPlaceholder('min-h-[22rem]')}
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
