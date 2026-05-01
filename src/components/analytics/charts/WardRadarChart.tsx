import { lazy } from 'react'
import { DEFAULT_ANALYTICS_BUNDLE, resolveChartAppearance } from '../../../lib/analyticsChartConfig'
import { DeferredVisible } from '../../ui/DeferredVisible'
import { analyticsChartScrimsPlaceholder, MIN_ANALYTICS_REVEAL_MS } from './analyticsDeferredWrap'

const Core = lazy(() => import('./WardRadarChartCore'))

export type { WardDatum, WardRadarChartProps } from './WardRadarChartCore'

export function WardRadarChart(props?: { className?: string }) {
  const { className } = props ?? {}
  const data = DEFAULT_ANALYTICS_BUNDLE.ward
  const appearance = resolveChartAppearance('ward')
  return (
    <DeferredVisible
      placeholder={analyticsChartScrimsPlaceholder('min-h-[22rem] w-full')}
      rootMargin="140px 0px"
      minRevealAfterLoadMs={MIN_ANALYTICS_REVEAL_MS}
    >
      <Core
        data={data}
        className={className}
        cardTitle={appearance.cardTitle}
        cardDescription={appearance.cardDescription}
      />
    </DeferredVisible>
  )
}
