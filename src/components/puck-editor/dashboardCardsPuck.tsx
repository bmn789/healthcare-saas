import { AlertTriangle, Award, Info, Sparkles, Star, TrendingUp } from 'lucide-react'
import type { ReactNode } from 'react'
import {
  type DashboardCardAccent,
  type DashboardCardAlertSeverity,
  DASHBOARD_CARDS_FIXTURE,
} from '../../lib/dashboardCardsFixture'
import { useStarredPatientsStore } from '../../store/starredPatientsStore'

export const DASHBOARD_CARD_FEATURED = 'DashboardCardFeatured' as const
export const DASHBOARD_CARD_TAGGED_METRIC = 'DashboardCardTaggedMetric' as const
export const DASHBOARD_CARD_INSIGHT = 'DashboardCardInsight' as const
export const DASHBOARD_CARD_HIGHLIGHT = 'DashboardCardHighlight' as const
export const DASHBOARD_CARD_ALERT = 'DashboardCardAlert' as const

const ALERT_TAG_SUBTLE_ON_COLOR_DARK: Record<
  DashboardCardAlertSeverity,
  string
> = {
  info: 'rounded-md border border-slate-200/90 bg-white/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-700 shadow-sm dark:border-sky-900/55 dark:bg-sky-800/65 dark:text-sky-50 dark:shadow-none',
  warn: 'rounded-md border border-slate-200/90 bg-white/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-700 shadow-sm dark:border-yellow-900/55 dark:bg-yellow-700/55 dark:text-yellow-50 dark:shadow-none',
  urgent:
    'rounded-md border border-slate-200/90 bg-white/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-700 shadow-sm dark:border-red-950/60 dark:bg-red-900/60 dark:text-red-50 dark:shadow-none',
}

const F = DASHBOARD_CARDS_FIXTURE

const HIGHLIGHT_DEFAULT_RIBBON =
  typeof F.highlight === 'object' &&
  F.highlight !== null &&
  'ribbonBody' in F.highlight &&
  typeof (F.highlight as { ribbonBody: unknown }).ribbonBody === 'string'
    ? (F.highlight as { ribbonBody: string }).ribbonBody
    : 'Use this ribbon for marquee wins — quick rounds, standout units, or quality milestones.'

function parseCommaTags(raw: unknown, max = 8): string[] {
  if (typeof raw !== 'string') return []
  return raw
    .replace(/\s*[·｜|]\s*/g, ',')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, max)
}

const FEATURED_ACCENT_BG: Record<DashboardCardAccent, string> = {
  violet:
    'bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-600 dark:from-violet-400 dark:via-fuchsia-500 dark:to-indigo-500',
  teal: 'bg-gradient-to-br from-teal-400 via-emerald-500 to-cyan-700 dark:from-teal-500 dark:to-cyan-600',
  sky: 'bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-700 dark:from-sky-500 dark:to-indigo-600',
  rose: 'bg-gradient-to-br from-rose-400 via-pink-500 to-violet-600 dark:from-rose-400 dark:to-violet-500',
}

function TagLine({
  tags,
  subtle,
  subtleOnAlertDarkSeverity,
}: {
  tags: string[]
  subtle?: boolean
  /** When set, dark-mode chip colors match alert stripe severity */
  subtleOnAlertDarkSeverity?: DashboardCardAlertSeverity
}) {
  if (tags.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((t) => (
        <span
          key={t}
          className={
            subtle
              ? subtleOnAlertDarkSeverity !== undefined
                ? ALERT_TAG_SUBTLE_ON_COLOR_DARK[subtleOnAlertDarkSeverity]
                : 'rounded-md border border-slate-200/90 bg-white/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-700 shadow-sm dark:border-slate-600/60 dark:bg-slate-800/80 dark:text-slate-100'
              : 'rounded-full border border-white/35 bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-inner backdrop-blur-sm dark:bg-white/10 dark:text-white'
          }
        >
          {t}
        </span>
      ))}
    </div>
  )
}

function FeaturedSpotlightCard({
  title,
  subtitle,
  tagsRaw,
  accentRaw,
  showProfiles,
}: {
  title: string
  subtitle: string
  tagsRaw: string
  accentRaw: string
  showProfiles: string
}) {
  const accent: DashboardCardAccent =
    accentRaw === 'teal' || accentRaw === 'sky' || accentRaw === 'rose' ? accentRaw : 'violet'
  const tags = parseCommaTags(tagsRaw)
  const starred = useStarredPatientsStore((s) => s.ids.length)
  const showStar =
    showProfiles === 'yes' ||
    showProfiles === 'true' ||
    (typeof showProfiles === 'string' && showProfiles.toLowerCase() === 'yes')

  return (
    <article className="min-h-0 min-w-0 w-full overflow-hidden rounded-2xl shadow-lg shadow-violet-900/10 ring-1 ring-violet-200/35 dark:shadow-black/35 dark:ring-violet-500/20">
      <div className={`${FEATURED_ACCENT_BG[accent]} p-[1px]`}>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-white/95 to-white/90 px-5 pb-5 pt-4 backdrop-blur-sm dark:from-slate-950 dark:to-slate-950/92">
          <div
            aria-hidden
            className={`pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full ${FEATURED_ACCENT_BG[accent]} opacity-[0.12] blur-3xl dark:opacity-[0.18]`}
          />
          <div className="relative flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <TagLine tags={tags.length ? tags : ['Featured']} subtle />
              <Sparkles size={18} className="shrink-0 text-violet-500/85 dark:text-violet-400/85" aria-hidden />
            </div>
            <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-violet-50">{title}</h3>
            {subtitle.trim() ? (
              <p className="text-sm leading-relaxed text-slate-600 dark:text-violet-200/85">{subtitle}</p>
            ) : null}
            {showStar ? (
              <div className="mt-1 flex flex-wrap items-center gap-2 rounded-xl border border-amber-200/70 bg-gradient-to-r from-amber-50 to-orange-50/80 px-3 py-2.5 dark:border-amber-500/30 dark:from-amber-950/50 dark:to-orange-950/35">
                <Star size={17} className="shrink-0 fill-amber-400 text-amber-500 dark:fill-amber-300 dark:text-amber-200" />
                <span className="text-sm font-medium text-amber-950 dark:text-amber-100">
                  Starred profiles: <strong className="tabular-nums font-semibold">{starred}</strong>
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}

function TaggedStatCard({
  label,
  value,
  hint,
  tagsRaw,
}: {
  label: string
  value: string
  hint: string
  tagsRaw: string
}) {
  const tags = parseCommaTags(tagsRaw)
  return (
    <article className="relative min-h-0 min-w-0 w-full overflow-hidden rounded-2xl border border-emerald-200/70 bg-white p-5 shadow-md shadow-emerald-900/10 dark:border-emerald-500/25 dark:bg-slate-950 dark:shadow-black/35">
      <div
        aria-hidden
        className="pointer-events-none absolute right-3 top-3 h-20 w-20 rounded-full bg-emerald-400/25 blur-2xl dark:bg-emerald-500/18"
      />
      <div className="relative space-y-3">
        <div className="flex items-start justify-between gap-3">
          <TagLine tags={tags} subtle />
          <TrendingUp size={18} className="mt-0.5 shrink-0 text-emerald-600 opacity-85 dark:text-emerald-400" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800/85 dark:text-emerald-300/90">
          {label}
        </p>
        <p className="text-3xl font-semibold tabular-nums tracking-tight text-slate-900 dark:text-emerald-50">{value}</p>
        {hint.trim() ? <p className="text-xs leading-relaxed text-slate-500 dark:text-emerald-200/65">{hint}</p> : null}
      </div>
    </article>
  )
}

function InsightWallCard({ title, body, tagsRaw }: { title: string; body: string; tagsRaw: string }) {
  const tags = parseCommaTags(tagsRaw)
  return (
    <article className="relative min-h-0 min-w-0 w-full overflow-hidden rounded-2xl border border-indigo-200/70 bg-gradient-to-br from-indigo-50/95 via-white to-violet-50/80 p-5 shadow-md dark:border-indigo-500/30 dark:from-indigo-950/80 dark:via-slate-950 dark:to-violet-950/60 dark:shadow-black/35">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-52 rotate-[-8deg] bg-indigo-400/13 blur-2xl dark:bg-indigo-500/22"
      />
      <div className="relative space-y-3">
        <TagLine tags={tags} subtle />
        <h3 className="text-base font-semibold text-slate-900 dark:text-indigo-100">{title}</h3>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-indigo-200/80">{body}</p>
      </div>
    </article>
  )
}

function HighlightRibbonCard({
  eyebrow,
  title,
  value,
  ribbonBody,
  tagsRaw,
}: {
  eyebrow: string
  title: string
  value: string
  ribbonBody: string
  tagsRaw: string
}) {
  const tags = parseCommaTags(tagsRaw)
  const ribbon = ribbonBody.trim() || HIGHLIGHT_DEFAULT_RIBBON
  const label = eyebrow.trim() || 'Spotlight'

  return (
    <article className="relative min-h-0 min-w-0 w-full overflow-hidden rounded-2xl bg-slate-950 text-white shadow-2xl shadow-violet-950/35 ring-1 ring-white/[0.08] dark:ring-violet-500/25">
      <div
        aria-hidden
        className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-fuchsia-500 to-violet-600"
      />
      <div className="relative flex flex-col md:flex-row md:items-stretch">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-24 h-48 w-48 rounded-full bg-fuchsia-500/25 blur-3xl md:right-0"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/4 h-36 w-72 rounded-full bg-indigo-600/20 blur-3xl"
        />

        <div className="relative flex flex-1 flex-col justify-between gap-4 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-indigo-800 px-6 py-5 md:w-[46%] md:min-w-[220px] md:border-r md:border-white/10">
          <div className="flex items-start justify-between gap-3">
            <TagLine tags={tags} />
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 shadow-inner backdrop-blur-sm">
              <Award size={20} className="text-amber-200" strokeWidth={1.75} aria-hidden />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">{label}</p>
            <h3 className="text-lg font-semibold leading-snug tracking-tight text-white">{title}</h3>
          </div>
          <div className="mt-1">
            <div className="inline-flex min-w-0 max-w-full items-baseline gap-2 rounded-xl border border-white/20 bg-black/20 px-4 py-3 shadow-inner backdrop-blur-md">
              <span className="text-3xl font-bold tabular-nums tracking-tight text-white">{value}</span>
            </div>
          </div>
        </div>

        <div className="relative flex flex-1 flex-col justify-center border-t border-white/[0.07] bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-950 px-6 py-5 md:border-l md:border-t-0 md:py-7">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-8 left-0 hidden w-px bg-gradient-to-b from-transparent via-violet-400/40 to-transparent md:block"
          />
          <p className="relative pl-0 text-[13px] leading-relaxed text-slate-300 md:pl-5 md:text-sm">
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-violet-300/90">
              Context
            </span>
            {ribbon}
          </p>
        </div>
      </div>
    </article>
  )
}

const ALERT_DARK_SHELL: Record<DashboardCardAlertSeverity, string> = {
  info: 'dark:border-sky-900/80 dark:shadow-black/50 dark:ring-sky-950/50',
  warn: 'dark:border-yellow-900/85 dark:shadow-black/55 dark:ring-yellow-950/55',
  urgent: 'dark:border-red-950/90 dark:shadow-black/55 dark:ring-red-950/55',
}

const ALERT_SEVERITY_META: Record<
  DashboardCardAlertSeverity,
  {
    bar: string
    icon: typeof Info
    badge: string
    label: string
    titleDark: string
    detailDark: string
  }
> = {
  info: {
    bar:
      'border-l-[4px] border-l-sky-500 bg-sky-50/92 dark:bg-sky-400 dark:border-l-[6px] dark:border-l-sky-900 dark:shadow-inner dark:shadow-sky-950/12',
    icon: Info,
    badge:
      'bg-sky-100 text-sky-900 border-sky-200/70 dark:border-sky-800 dark:bg-sky-500 dark:text-sky-950 dark:shadow-none',
    titleDark: 'dark:text-sky-950 dark:drop-shadow-none',
    detailDark: 'dark:text-sky-950/84',
    label: 'FYI',
  },
  warn: {
    bar:
      'border-l-[4px] border-l-amber-500 bg-amber-50/95 dark:bg-yellow-400 dark:border-l-[6px] dark:border-l-yellow-900 dark:shadow-inner dark:shadow-yellow-950/10',
    icon: AlertTriangle,
    badge:
      'bg-amber-100 text-amber-950 border-amber-200/80 dark:border-yellow-800 dark:bg-yellow-500 dark:text-yellow-950 dark:shadow-none',
    titleDark: 'dark:text-yellow-950 dark:drop-shadow-none',
    detailDark: 'dark:text-yellow-950/82',
    label: 'Heads-up',
  },
  urgent: {
    bar:
      'border-l-[4px] border-l-red-600 bg-red-50/96 dark:bg-red-500 dark:border-l-[6px] dark:border-l-red-950 dark:shadow-inner dark:shadow-red-950/25',
    icon: AlertTriangle,
    badge:
      'bg-red-100 text-red-950 border-red-200/80 dark:border-red-900 dark:bg-red-600 dark:text-red-50 dark:shadow-none',
    titleDark: 'dark:text-red-50 dark:drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]',
    detailDark: 'dark:text-red-50/88',
    label: 'Urgent',
  },
}

function AlertRailCard({
  severityRaw,
  title,
  detail,
  tagsRaw,
}: {
  severityRaw: string
  title: string
  detail: string
  tagsRaw: string
}) {
  const severity: DashboardCardAlertSeverity =
    severityRaw === 'info' || severityRaw === 'urgent' ? severityRaw : 'warn'
  const meta = ALERT_SEVERITY_META[severity]
  const Icon = meta.icon
  const tags = parseCommaTags(tagsRaw)

  return (
    <article
      role="alert"
      className={`relative min-h-0 min-w-0 w-full overflow-hidden rounded-xl border-y border-r border-slate-200/80 shadow-sm ring-1 ring-slate-200/35 ${ALERT_DARK_SHELL[severity]} ${meta.bar}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-3 left-[3px] w-px bg-gradient-to-b from-transparent via-white/55 to-transparent opacity-75 dark:hidden"
      />
      <div className="flex gap-4 p-4 pl-5">
        <div
          className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border shadow-sm dark:shadow-black/35 ${meta.badge}`}
        >
          <Icon size={20} className="relative z-[1]" aria-hidden />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2 gap-y-2">
            <span
              className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${meta.badge}`}
            >
              {meta.label}
            </span>
            <TagLine tags={tags} subtle subtleOnAlertDarkSeverity={severity} />
          </div>
          <h3 className={`text-base font-semibold text-slate-950 ${meta.titleDark}`}>{title}</h3>
          {detail.trim() ? (
            <p className={`text-sm leading-relaxed text-slate-700 ${meta.detailDark}`}>{detail}</p>
          ) : null}
        </div>
      </div>
    </article>
  )
}

type BlockBase = {
  fields: Record<string, unknown>
  defaultProps: Record<string, unknown>
  render: (p: Record<string, unknown>) => ReactNode
  label: string
}

export function dashboardCardFeaturedBlock(): BlockBase {
  return {
    label: 'Featured + tags (+ starred)',
    fields: {
      title: { type: 'text' as const, label: 'Title' },
      subtitle: { type: 'textarea' as const, label: 'Subtitle' },
      tags: {
        type: 'textarea' as const,
        label: 'Tags (comma or middot-separated)',
      },
      accent: {
        type: 'radio' as const,
        label: 'Accent',
        options: [
          { label: 'Violet', value: 'violet' },
          { label: 'Teal', value: 'teal' },
          { label: 'Sky', value: 'sky' },
          { label: 'Rose', value: 'rose' },
        ],
      },
      showStarredProfiles: {
        type: 'radio' as const,
        label: 'Starred profile count',
        options: [
          { label: 'Show live count', value: 'yes' },
          { label: 'Hide', value: 'no' },
        ],
      },
    },
    defaultProps: {
      title: F.featured.title,
      subtitle: F.featured.subtitle,
      tags: F.featured.tags,
      accent: F.featured.accent,
      showStarredProfiles: F.featured.showStarredProfiles ? 'yes' : 'no',
    },
    render: (p) => (
      <FeaturedSpotlightCard
        title={typeof p.title === 'string' ? p.title : F.featured.title}
        subtitle={typeof p.subtitle === 'string' ? p.subtitle : F.featured.subtitle}
        tagsRaw={typeof p.tags === 'string' ? p.tags : F.featured.tags}
        accentRaw={typeof p.accent === 'string' ? p.accent : F.featured.accent}
        showProfiles={
          typeof p.showStarredProfiles === 'boolean'
            ? p.showStarredProfiles
              ? 'yes'
              : 'no'
            : typeof p.showStarredProfiles === 'string'
              ? p.showStarredProfiles
              : F.featured.showStarredProfiles
                ? 'yes'
                : 'no'
        }
      />
    ),
  }
}

export function dashboardCardTaggedMetricBlock(): BlockBase {
  return {
    label: 'Tagged metric',
    fields: {
      label: { type: 'text' as const, label: 'Label' },
      value: { type: 'text' as const, label: 'Value' },
      hint: { type: 'textarea' as const, label: 'Hint / trend' },
      tags: {
        type: 'textarea' as const,
        label: 'Tags (comma or middot-separated)',
      },
    },
    defaultProps: {
      label: F.taggedMetric.label,
      value: F.taggedMetric.value,
      hint: F.taggedMetric.hint,
      tags: F.taggedMetric.tags,
    },
    render: (p) => (
      <TaggedStatCard
        label={typeof p.label === 'string' ? p.label : F.taggedMetric.label}
        value={typeof p.value === 'string' ? p.value : F.taggedMetric.value}
        hint={typeof p.hint === 'string' ? p.hint : F.taggedMetric.hint}
        tagsRaw={typeof p.tags === 'string' ? p.tags : F.taggedMetric.tags}
      />
    ),
  }
}

export function dashboardCardInsightBlock(): BlockBase {
  return {
    label: 'Insight narrative',
    fields: {
      title: { type: 'text' as const, label: 'Title' },
      body: { type: 'textarea' as const, label: 'Body' },
      tags: {
        type: 'textarea' as const,
        label: 'Tags',
      },
    },
    defaultProps: {
      title: F.insight.title,
      body: F.insight.body,
      tags: F.insight.tags,
    },
    render: (p) => (
      <InsightWallCard
        title={typeof p.title === 'string' ? p.title : F.insight.title}
        body={typeof p.body === 'string' ? p.body : F.insight.body}
        tagsRaw={typeof p.tags === 'string' ? p.tags : F.insight.tags}
      />
    ),
  }
}

export function dashboardCardHighlightBlock(): BlockBase {
  return {
    label: 'Highlight ribbon',
    fields: {
      eyebrow: { type: 'text' as const, label: 'Eyebrow' },
      title: { type: 'text' as const, label: 'Title' },
      value: { type: 'text' as const, label: 'Headline stat' },
      ribbonBody: { type: 'textarea' as const, label: 'Ribbon context' },
      tags: {
        type: 'textarea' as const,
        label: 'Tags',
      },
    },
    defaultProps: {
      eyebrow: F.highlight.eyebrow,
      title: F.highlight.title,
      value: F.highlight.value,
      ribbonBody: HIGHLIGHT_DEFAULT_RIBBON,
      tags: F.highlight.tags,
    },
    render: (p) => (
      <HighlightRibbonCard
        eyebrow={typeof p.eyebrow === 'string' ? p.eyebrow : F.highlight.eyebrow}
        title={typeof p.title === 'string' ? p.title : F.highlight.title}
        value={typeof p.value === 'string' ? p.value : F.highlight.value}
        ribbonBody={typeof p.ribbonBody === 'string' ? p.ribbonBody : HIGHLIGHT_DEFAULT_RIBBON}
        tagsRaw={typeof p.tags === 'string' ? p.tags : F.highlight.tags}
      />
    ),
  }
}

export function dashboardCardAlertBlock(): BlockBase {
  return {
    label: 'Alert stripe',
    fields: {
      severity: {
        type: 'radio' as const,
        label: 'Severity',
        options: [
          { label: 'Info', value: 'info' },
          { label: 'Warning', value: 'warn' },
          { label: 'Urgent', value: 'urgent' },
        ],
      },
      title: { type: 'text' as const, label: 'Title' },
      detail: { type: 'textarea' as const, label: 'Detail' },
      tags: { type: 'textarea' as const, label: 'Tags' },
    },
    defaultProps: {
      severity: F.alert.severity,
      title: F.alert.title,
      detail: F.alert.detail,
      tags: F.alert.tags,
    },
    render: (p) => (
      <AlertRailCard
        severityRaw={typeof p.severity === 'string' ? p.severity : F.alert.severity}
        title={typeof p.title === 'string' ? p.title : F.alert.title}
        detail={typeof p.detail === 'string' ? p.detail : F.alert.detail}
        tagsRaw={typeof p.tags === 'string' ? p.tags : F.alert.tags}
      />
    ),
  }
}
