import moment from 'moment'
import type { AppNotification } from '../../types/notification'
import { NotificationBellIcon } from './NotificationBellIcon'

type NotificationGridProps = {
  items: AppNotification[]
}

export const NotificationGrid = ({ items }: NotificationGridProps) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {items.map((n, index) => (
      <div
        key={n.id}
        className={n.read ? 'opacity-[0.55] transition-opacity duration-300 hover:opacity-100' : undefined}
      >
        <article
          style={{ animationDelay: `${index * 55}ms` }}
          className="patient-slide-in rounded-xl border border-violet-200/70 bg-white p-4 shadow-sm shadow-violet-200/25 transition-[box-shadow] duration-300 hover:shadow-md hover:shadow-violet-300/25 dark:border-violet-500/20 dark:bg-slate-950 dark:shadow-violet-950/30 dark:hover:shadow-violet-900/40"
        >
          <div className="flex gap-3">
            <NotificationBellIcon read={n.read} size="lg" />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-slate-900 dark:text-violet-100">{n.title}</h3>
              <time
                className="mt-0.5 block text-xs text-violet-700/85 dark:text-violet-300/80"
                dateTime={n.createdAt}
                title={moment(n.createdAt).format('llll')}
              >
                {moment(n.createdAt).fromNow()}
              </time>
            </div>
          </div>
          <p className="mt-3 line-clamp-3 text-sm text-slate-700 dark:text-violet-200/90">{n.message}</p>
        </article>
      </div>
    ))}
  </div>
)
