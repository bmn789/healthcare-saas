import { Bell, ChevronRight, Sparkles, Star, Users } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import patientsFixture from '../../data/patients.json'
import notificationsFixture from '../../data/notifications.json'
import { DASHBOARD_CARDS_FIXTURE } from '../../lib/dashboardCardsFixture'
import { useStarredPatientsStore } from '../../store/starredPatientsStore'
import type { AppNotification } from '../../types/notification'
import type { Patient } from '../../types/patient'

export const DASHBOARD_CARD_ACTION_STRIP = 'DashboardActionStrip' as const

const F = DASHBOARD_CARDS_FIXTURE

const PATIENT_ROWS = patientsFixture as Patient[]
const NOTIFICATION_ROWS = notificationsFixture as AppNotification[]

const ACTIVE_PATIENT_TOTAL = PATIENT_ROWS.length
const UNREAD_NOTIFICATION_COUNT = NOTIFICATION_ROWS.filter((n) => !n.read).length

type ActionStripFixture = {
  eyebrow?: string
  title?: string
  patientsLabel?: string
  patientsHint?: string
  starredLabel?: string
  starredHint?: string
  notificationsLabel?: string
  notificationsHint?: string
}

const ASF: ActionStripFixture =
  typeof F === 'object' && F !== null && 'actionStrip' in F && typeof (F as { actionStrip?: unknown }).actionStrip === 'object'
    ? ((F as { actionStrip?: ActionStripFixture }).actionStrip ?? {})
    : {}

function unwrapFixtureString(key: keyof ActionStripFixture, fallback: string) {
  const v = ASF[key]
  return typeof v === 'string' && v.trim() ? v.trim() : fallback
}

const DEFAULT_EYEBROW = unwrapFixtureString('eyebrow', 'Operational pulse')
const DEFAULT_TITLE = unwrapFixtureString('title', 'Care team shortcuts')
const DEFAULT_PAT_LABEL = unwrapFixtureString('patientsLabel', 'Active patients')
const DEFAULT_PAT_HINT = unwrapFixtureString('patientsHint', 'Live census from roster')
const DEFAULT_STAR_LABEL = unwrapFixtureString('starredLabel', 'Starred patients')
const DEFAULT_STAR_HINT = unwrapFixtureString('starredHint', 'Pinned profiles for rounds')
const DEFAULT_NTF_LABEL = unwrapFixtureString('notificationsLabel', 'Active notifications')
const DEFAULT_NTF_HINT = unwrapFixtureString('notificationsHint', 'Unread inbox items')

function ActionTileStat({
  value,
  label,
  hint,
  icon,
  accentRing,
}: {
  value: number
  label: string
  hint: string
  icon: ReactNode
  accentRing: string
}) {
  return (
    <>
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border bg-white/80 dark:bg-slate-900/85 ${accentRing}`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-[2rem] font-semibold leading-none tabular-nums tracking-tight text-slate-900 dark:text-white">
          {value}
        </p>
        {hint.trim() ? <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{hint}</p> : null}
      </div>
    </>
  )
}

function DashboardActionStripView({
  eyebrow,
  title,
  patientsLabel,
  patientsHint,
  starredLabel,
  starredHint,
  notificationsLabel,
  notificationsHint,
}: {
  eyebrow: string
  title: string
  patientsLabel: string
  patientsHint: string
  starredLabel: string
  starredHint: string
  notificationsLabel: string
  notificationsHint: string
}) {
  const starredCount = useStarredPatientsStore((s) => s.ids.length)
  const activeNotifications = UNREAD_NOTIFICATION_COUNT

  return (
    <section
      aria-labelledby="dashboard-action-strip-title"
    >
      <div >
      
        <header className="relative mb-5 flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            {eyebrow.trim() ? (
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-violet-600/95 dark:text-violet-300/90">
                <Sparkles size={14} className="opacity-85" aria-hidden />
                {title}
              </p>
            ) : null}
            {/* <h2 id="dashboard-action-strip-title" className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h2> */}
          </div>
        </header>

        <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-3 lg:gap-4">
          <Link
            to="/patients"
            className="group relative flex min-h-[148px] items-stretch gap-4 overflow-hidden rounded-2xl border border-emerald-200/80 bg-emerald-50 p-4 outline-none ring-emerald-500/0 transition-[transform,border-color] hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50/95 focus-visible:border-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-emerald-500/30 dark:bg-emerald-950/35 dark:hover:border-emerald-400/50 dark:hover:bg-emerald-950/55 dark:focus-visible:ring-emerald-400"
            aria-label={`${patientsLabel}: ${ACTIVE_PATIENT_TOTAL}. Go to patient records`}
          >
            <div className="absolute right-4 top-4 z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-300/90 bg-emerald-200 text-emerald-900 ring-1 ring-emerald-400/25 transition-[background-color,border-color,transform] group-hover:bg-emerald-300/90 dark:border-emerald-600 dark:bg-emerald-950 dark:text-emerald-100 dark:ring-emerald-500/30 dark:group-hover:border-emerald-500 dark:group-hover:bg-emerald-900 dark:group-hover:text-white">
              <ChevronRight
                size={18}
                strokeWidth={2.25}
                className="text-emerald-900 transition-transform group-hover:translate-x-px dark:text-emerald-100 dark:group-hover:text-white"
                aria-hidden
              />
            </div>
            <ActionTileStat
              value={ACTIVE_PATIENT_TOTAL}
              label={patientsLabel}
              hint={patientsHint}
              accentRing="border-emerald-200/85 text-emerald-700 dark:border-emerald-600/65 dark:text-emerald-300"
              icon={<Users size={21} aria-hidden />}
            />
          </Link>

          <div className="flex min-h-[148px] items-stretch gap-4 rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 via-white to-orange-50/95 p-4 dark:border-amber-500/35 dark:from-amber-950/50 dark:via-slate-950 dark:to-orange-950/40">
            <ActionTileStat
              value={starredCount}
              label={starredLabel}
              hint={starredHint}
              accentRing="border-amber-200/95 text-amber-700 dark:border-amber-600/65 dark:text-amber-300"
              icon={<Star size={21} className="fill-amber-400 dark:fill-amber-400" aria-hidden />}
            />
          </div>

          <Link
            to="/notifications"
            className="group relative flex min-h-[148px] items-stretch gap-4 overflow-hidden rounded-2xl border border-violet-200/90 bg-violet-50 p-4 outline-none ring-violet-500/0 transition-[transform,border-color] hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50/95 focus-visible:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-violet-500/30 dark:bg-violet-950/40 dark:hover:border-violet-400/60 dark:hover:bg-violet-950/60 dark:focus-visible:ring-violet-400"
            aria-label={`${notificationsLabel}: ${activeNotifications}. Go to notifications`}
          >
            <div className="absolute right-4 top-4 z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-violet-300/95 bg-violet-200 text-violet-950 ring-1 ring-violet-400/25 transition-[background-color,border-color,transform] group-hover:bg-violet-300/90 dark:border-violet-600 dark:bg-violet-950 dark:text-violet-100 dark:ring-violet-500/35 dark:group-hover:border-violet-500 dark:group-hover:bg-violet-900 dark:group-hover:text-white">
              <ChevronRight
                size={18}
                strokeWidth={2.25}
                className="text-violet-950 transition-transform group-hover:translate-x-px dark:text-violet-100 dark:group-hover:text-white"
                aria-hidden
              />
            </div>
            {activeNotifications > 0 ? (
              <span className="absolute left-16 top-[18px] h-2 w-2 rounded-full bg-teal-500 animate-pulse" aria-hidden />
            ) : null}
            <ActionTileStat
              value={activeNotifications}
              label={notificationsLabel}
              hint={notificationsHint}
              accentRing="border-violet-200/90 text-violet-700 dark:border-violet-600/65 dark:text-violet-300"
              icon={<Bell size={21} aria-hidden />}
            />
          </Link>
        </div>
      </div>
    </section>
  )
}

type BlockBase = {
  fields: Record<string, unknown>
  defaultProps: Record<string, unknown>
  render: (p: Record<string, unknown>) => ReactNode
  label: string
}

export function dashboardActionStripBlock(): BlockBase {
  return {
    label: 'Action strip (Patients · Starred · Notifications)',
    fields: {
      eyebrow: { type: 'text' as const, label: 'Eyebrow' },
      title: { type: 'text' as const, label: 'Title' },
      patientsLabel: { type: 'text' as const, label: 'Patients column label' },
      patientsHint: { type: 'textarea' as const, label: 'Patients subtitle' },
      starredLabel: { type: 'text' as const, label: 'Starred column label' },
      starredHint: { type: 'textarea' as const, label: 'Starred subtitle' },
      notificationsLabel: { type: 'text' as const, label: 'Notifications column label' },
      notificationsHint: { type: 'textarea' as const, label: 'Notifications subtitle' },
    },
    defaultProps: {
      eyebrow: DEFAULT_EYEBROW,
      title: DEFAULT_TITLE,
      patientsLabel: DEFAULT_PAT_LABEL,
      patientsHint: DEFAULT_PAT_HINT,
      starredLabel: DEFAULT_STAR_LABEL,
      starredHint: DEFAULT_STAR_HINT,
      notificationsLabel: DEFAULT_NTF_LABEL,
      notificationsHint: DEFAULT_NTF_HINT,
    },
    render: (p) => (
      <DashboardActionStripView
        eyebrow={typeof p.eyebrow === 'string' ? p.eyebrow : DEFAULT_EYEBROW}
        title={typeof p.title === 'string' ? p.title : DEFAULT_TITLE}
        patientsLabel={typeof p.patientsLabel === 'string' ? p.patientsLabel : DEFAULT_PAT_LABEL}
        patientsHint={typeof p.patientsHint === 'string' ? p.patientsHint : DEFAULT_PAT_HINT}
        starredLabel={typeof p.starredLabel === 'string' ? p.starredLabel : DEFAULT_STAR_LABEL}
        starredHint={typeof p.starredHint === 'string' ? p.starredHint : DEFAULT_STAR_HINT}
        notificationsLabel={typeof p.notificationsLabel === 'string' ? p.notificationsLabel : DEFAULT_NTF_LABEL}
        notificationsHint={typeof p.notificationsHint === 'string' ? p.notificationsHint : DEFAULT_NTF_HINT}
      />
    ),
  }
}
