import type { ReactNode } from 'react'

const cardClass =
  'rounded-lg border border-violet-200/70 bg-white p-4 shadow-sm shadow-violet-200/20 dark:border-violet-500/20 dark:bg-slate-950 dark:shadow-violet-900/30'

type AnalyticsChartCardProps = {
  title: string
  description?: string
  children: ReactNode
  className?: string
  headerRight?: ReactNode
}

export function AnalyticsChartCard({
  title,
  description,
  children,
  className,
  headerRight,
}: AnalyticsChartCardProps) {
  return (
    <div className={className ? `${cardClass} ${className}` : cardClass}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 space-y-1">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-violet-100">{title}</h2>
          {description ? (
            <p className="text-xs text-violet-700/80 dark:text-violet-300/75">{description}</p>
          ) : null}
        </div>
        {headerRight}
      </div>
      {children}
    </div>
  )
}
