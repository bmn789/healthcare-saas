import { LayoutGrid } from 'lucide-react'
import { Link } from 'react-router-dom'

type DashboardCustomizeViewButtonProps = {
  className?: string
}

const btnClass =
  'inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-violet-200/80 bg-white px-3 py-2 text-sm font-medium text-violet-900 outline-none ring-violet-400/35 transition hover:bg-violet-50 focus-visible:ring-2 dark:border-violet-500/30 dark:bg-slate-900 dark:text-violet-100 dark:ring-violet-500/35 dark:hover:bg-violet-500/15'

export const DashboardCustomizeViewButton = ({
  className = '',
}: DashboardCustomizeViewButtonProps) => {
  return (
    <Link
      to="/dashboard/customization"
      className={[btnClass, className].filter(Boolean).join(' ')}
      aria-label="Customize Home dashboard view"
    >
      <LayoutGrid size={14} aria-hidden />
      Customize view
    </Link>
  )
}
