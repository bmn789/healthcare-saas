import { lazy } from 'react'
import { DEFAULT_ANALYTICS_BUNDLE, resolveChartAppearance } from '../../../lib/analyticsChartConfig'
import { DeferredVisible } from '../../ui/DeferredVisible'
import { analyticsChartScrimsPlaceholder, MIN_ANALYTICS_REVEAL_MS } from './analyticsDeferredWrap'

const Core = lazy(() => import('./AppointmentStackedChartCore'))

export type { AppointmentDatum, AppointmentStackedChartProps } from './AppointmentStackedChartCore'

export function AppointmentStackedChart() {
  const data = DEFAULT_ANALYTICS_BUNDLE.appointments
  const appearance = resolveChartAppearance('appointments')
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
