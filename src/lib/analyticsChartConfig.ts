import defaultAppointments from '../data/analytics-appointments.json'
import defaultDemographics from '../data/analytics-demographics.json'
import defaultDepartments from '../data/analytics-departments.json'
import defaultFinancial from '../data/analytics-financial.json'
import defaultQuality from '../data/analytics-quality.json'
import defaultTrends from '../data/analytics-trends.json'
import defaultWaitTimes from '../data/analytics-wait-times.json'
import defaultWards from '../data/analytics-wards.json'

export const ANALYTICS_CHART_IDS = [
  'weeklyThroughput',
  'departmentVolume',
  'demographics',
  'waitTime',
  'revenue',
  'ward',
  'appointments',
  'quality',
] as const

export type AnalyticsChartId = (typeof ANALYTICS_CHART_IDS)[number]

export const DEFAULT_ANALYTICS_LAYOUT_ORDER: AnalyticsChartId[] = [...ANALYTICS_CHART_IDS]

export const ANALYTICS_CHART_LABELS: Record<AnalyticsChartId, string> = {
  weeklyThroughput: 'Weekly admission & discharge throughput',
  departmentVolume: 'Cases by department',
  demographics: 'Patient age bands',
  waitTime: 'Median wait time by care setting',
  revenue: 'Revenue vs operating expenses',
  ward: 'Ward scorecard',
  appointments: 'Ambulatory fulfillment',
  quality: 'Clinical quality trajectory',
}

export type AnalyticsChartsBundle = {
  weeklyThroughput: typeof defaultTrends
  departmentVolume: typeof defaultDepartments
  demographics: typeof defaultDemographics
  waitTime: typeof defaultWaitTimes
  revenue: typeof defaultFinancial
  ward: typeof defaultWards
  appointments: typeof defaultAppointments
  quality: typeof defaultQuality
}

export const DEFAULT_ANALYTICS_BUNDLE: AnalyticsChartsBundle = {
  weeklyThroughput: defaultTrends,
  departmentVolume: defaultDepartments,
  demographics: defaultDemographics,
  waitTime: defaultWaitTimes,
  revenue: defaultFinancial,
  ward: defaultWards,
  appointments: defaultAppointments,
  quality: defaultQuality,
}

export type ResolvedChartAppearance = {
  cardTitle: string
  cardDescription: string
  throughputDisplay: 'line' | 'column'
}

export const DEFAULT_CHART_CARD_COPY: Record<AnalyticsChartId, ResolvedChartAppearance> = {
  weeklyThroughput: {
    cardTitle: 'Weekly admission & discharge throughput',
    cardDescription: 'Switch between line and column views for board briefings.',
    throughputDisplay: 'line',
  },
  departmentVolume: {
    cardTitle: 'Cases by department',
    cardDescription: 'Trailing 90-day volume indexed for staffing models.',
    throughputDisplay: 'line',
  },
  demographics: {
    cardTitle: 'Patient age bands',
    cardDescription: 'Share of active panel by demographic segment.',
    throughputDisplay: 'line',
  },
  waitTime: {
    cardTitle: 'Median wait time by care setting',
    cardDescription: 'Minutes to first clinical contact; rolling eight-week view.',
    throughputDisplay: 'line',
  },
  revenue: {
    cardTitle: 'Revenue vs operating expenses',
    cardDescription: 'Adjusted millions; illustrates margin pressure month over month.',
    throughputDisplay: 'line',
  },
  ward: {
    cardTitle: 'Ward scorecard',
    cardDescription: 'Normalized 0–100: occupancy load, throughput, satisfaction.',
    throughputDisplay: 'line',
  },
  appointments: {
    cardTitle: 'Ambulatory fulfillment',
    cardDescription: 'Completed, rescheduled, and no-show visits by weekday.',
    throughputDisplay: 'line',
  },
  quality: {
    cardTitle: 'Clinical quality trajectory',
    cardDescription:
      'All-cause 30-day readmission % and hospital-acquired conditions per 1000 discharges.',
    throughputDisplay: 'line',
  },
}

export function resolveChartAppearance(id: AnalyticsChartId): ResolvedChartAppearance {
  return { ...DEFAULT_CHART_CARD_COPY[id] }
}
