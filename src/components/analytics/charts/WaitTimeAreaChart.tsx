import { lazy } from 'react'
import { DEFAULT_ANALYTICS_BUNDLE, resolveChartAppearance } from '../../../lib/analyticsChartConfig'
import { DeferredVisible } from '../../ui/DeferredVisible'
import { analyticsChartScrimsPlaceholder, MIN_ANALYTICS_REVEAL_MS } from './analyticsDeferredWrap'

const Core = lazy(() => import('./WaitTimeAreaChartCore'))

export type { WaitTimeDatum, WaitTimeAreaChartProps } from './WaitTimeAreaChartCore'

export function WaitTimeAreaChart() {
  const data = DEFAULT_ANALYTICS_BUNDLE.waitTime
  const appearance = resolveChartAppearance('waitTime')
  return (
    <DeferredVisible
      placeholder={analyticsChartScrimsPlaceholder('min-h-[24rem]')}
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
