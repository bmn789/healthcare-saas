import { lazy } from 'react'
import { DEFAULT_ANALYTICS_BUNDLE, resolveChartAppearance } from '../../../lib/analyticsChartConfig'
import { DeferredVisible } from '../../ui/DeferredVisible'
import { analyticsChartScrimsPlaceholder, MIN_ANALYTICS_REVEAL_MS } from './analyticsDeferredWrap'

const Core = lazy(() => import('./DepartmentVolumeChartCore'))

export type { DepartmentDatum, DepartmentVolumeChartProps } from './DepartmentVolumeChartCore'

export function DepartmentVolumeChart() {
  const data = DEFAULT_ANALYTICS_BUNDLE.departmentVolume
  const appearance = resolveChartAppearance('departmentVolume')
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
