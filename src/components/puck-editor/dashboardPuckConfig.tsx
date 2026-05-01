import type { Config } from '@puckeditor/core'
import {
  DASHBOARD_METRIC_IDS,
  DASHBOARD_METRIC_LABELS,
  DEFAULT_DASHBOARD_METRICS,
  DASHBOARD_METRIC_TILE_CLASSNAME,
  type DashboardMetricId,
  PUCK_TYPE_BY_METRIC_ID,
} from '../../lib/dashboardOverviewStorage'
import { useDashboardOverviewStore } from '../../store/dashboardOverviewStore'
import {
  ANALYTICS_PUCK_CATEGORY_ORDER,
  dashboardAnalyticsChartComponents,
} from './dashboardAnalyticsChartsPuck'
import {
  dashboardActionStripBlock,
  DASHBOARD_CARD_ACTION_STRIP,
} from './dashboardActionStripPuck'
import {
  dashboardCardAlertBlock,
  dashboardCardFeaturedBlock,
  dashboardCardHighlightBlock,
  dashboardCardInsightBlock,
  dashboardCardTaggedMetricBlock,
  DASHBOARD_CARD_ALERT,
  DASHBOARD_CARD_FEATURED,
  DASHBOARD_CARD_HIGHLIGHT,
  DASHBOARD_CARD_INSIGHT,
  DASHBOARD_CARD_TAGGED_METRIC,
} from './dashboardCardsPuck'
import {
  createPuckLayoutRowBlock,
  PUCK_LAYOUT_ROW_TYPE,
} from './PuckLayout'
import { createPuckSpaceBlock, PUCK_SPACE_TYPE } from './Space_Puck'

type TileFields = { label?: string; value?: string }

function resolveTileCopy(id: DashboardMetricId, label?: string, value?: string) {
  const d = DEFAULT_DASHBOARD_METRICS[id]
  const fromStore = useDashboardOverviewStore.getState().metrics[id]
  return {
    label:
      typeof label === 'string' && label.trim()
        ? label.trim()
        : (fromStore?.label ?? d.label),
    value:
      typeof value === 'string' && value.trim()
        ? value.trim()
        : (fromStore?.value ?? d.value),
  }
}

function makeOverviewMetricBlock(id: DashboardMetricId) {
  const defaults = DEFAULT_DASHBOARD_METRICS[id]
  return {
    label: DASHBOARD_METRIC_LABELS[id],
    fields: {
      label: { type: 'text' as const, label: 'Metric label' },
      value: { type: 'text' as const, label: 'Metric value' },
    },
    defaultProps: {
      id: `${PUCK_TYPE_BY_METRIC_ID[id]}:${id}`,
      label: defaults.label,
      value: defaults.value,
    },
    render: ({ label, value }: TileFields) => {
      const { label: lbl, value: val } = resolveTileCopy(id, label, value)
      return (
        <article className={DASHBOARD_METRIC_TILE_CLASSNAME}>
          <p className="text-sm text-violet-700/80 dark:text-violet-300/80">{lbl}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-violet-100">{val}</p>
        </article>
      )
    },
  }
}

const categoryMetricOrder = DASHBOARD_METRIC_IDS.map((id) => PUCK_TYPE_BY_METRIC_ID[id])

export const dashboardPuckConfig = {
  categories: {
    layouts: {
      title: 'Layouts',
      defaultExpanded: true,
      components: [PUCK_LAYOUT_ROW_TYPE, PUCK_SPACE_TYPE],
    },
    overview: {
      title: 'Home overview tiles',
      defaultExpanded: true,
      components: [...categoryMetricOrder],
    },
    actionCard: {
      title: 'Action Card',
      defaultExpanded: true,
      components: [DASHBOARD_CARD_ACTION_STRIP],
    },
    cards: {
      title: 'Tagged cards',
      defaultExpanded: true,
      components: [
        DASHBOARD_CARD_FEATURED,
        DASHBOARD_CARD_HIGHLIGHT,
        DASHBOARD_CARD_TAGGED_METRIC,
        DASHBOARD_CARD_INSIGHT,
        DASHBOARD_CARD_ALERT,
      ],
    },
    analytics: {
      title: 'Analytics charts',
      defaultExpanded: true,
      components: [...ANALYTICS_PUCK_CATEGORY_ORDER],
    },
  },
  components: {
    [PUCK_SPACE_TYPE]: createPuckSpaceBlock(),
    [PUCK_LAYOUT_ROW_TYPE]: createPuckLayoutRowBlock(),
    [DASHBOARD_CARD_FEATURED]: dashboardCardFeaturedBlock(),
    [DASHBOARD_CARD_HIGHLIGHT]: dashboardCardHighlightBlock(),
    [DASHBOARD_CARD_TAGGED_METRIC]: dashboardCardTaggedMetricBlock(),
    [DASHBOARD_CARD_INSIGHT]: dashboardCardInsightBlock(),
    [DASHBOARD_CARD_ALERT]: dashboardCardAlertBlock(),
    [DASHBOARD_CARD_ACTION_STRIP]: dashboardActionStripBlock(),
    DashboardOverviewActivePatients: makeOverviewMetricBlock('activePatients'),
    DashboardOverviewDoctorsOnShift: makeOverviewMetricBlock('doctorsOnShift'),
    DashboardOverviewCriticalAlerts: makeOverviewMetricBlock('criticalAlerts'),
    DashboardOverviewAvgWaitTime: makeOverviewMetricBlock('avgWaitTime'),
    ...dashboardAnalyticsChartComponents(),
  },
} as Config
