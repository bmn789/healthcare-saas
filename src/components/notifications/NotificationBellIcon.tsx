import { Bell } from 'lucide-react'
import { Tooltip } from '../ui/Tooltip'

const SIZES = {
  sm: { box: 'h-10 w-10', icon: 18 },
  lg: { box: 'h-12 w-12', icon: 22 },
} as const

type NotificationBellIconProps = {
  read: boolean
  size?: keyof typeof SIZES
}

export function NotificationBellIcon({ read, size = 'sm' }: NotificationBellIconProps) {
  const { box, icon } = SIZES[size]
  const tooltip = read ? 'Read' : 'New'

  return (
    <Tooltip content={tooltip} side="top">
      <div
        className="relative inline-flex shrink-0 cursor-default"
        aria-label={read ? 'Read notification' : 'New notification'}
      >
        <div
          className={`flex ${box} items-center justify-center rounded-full bg-violet-100 text-violet-700 dark:bg-violet-500/25 dark:text-violet-200`}
        >
          <Bell size={icon} aria-hidden />
        </div>
        <span
          className={`pointer-events-none absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-slate-950 ${read ? 'bg-slate-400 dark:bg-slate-500' : 'bg-emerald-500'}`}
          aria-hidden
        />
      </div>
    </Tooltip>
  )
}
