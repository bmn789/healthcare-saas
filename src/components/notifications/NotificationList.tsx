import moment from 'moment'
import type { NotificationSortKey } from '../../lib/notificationQuery'
import type { SortDir } from '../../lib/patientQuery'
import type { AppNotification } from '../../types/notification'
import { NotificationBellIcon } from './NotificationBellIcon'
import { SortableTh } from '../records/SortableTh'

type NotificationListProps = {
  items: AppNotification[]
  sortKey: NotificationSortKey
  sortDir: SortDir
  onSort: (key: NotificationSortKey) => void
}

export const NotificationList = ({ items, sortKey, sortDir, onSort }: NotificationListProps) => (
  <div className="flex h-full min-h-0 w-full min-w-0 max-w-full flex-col overflow-hidden rounded-xl border border-violet-200/80 bg-white shadow-sm shadow-violet-200/25 dark:border-violet-500/40 dark:bg-slate-950 dark:shadow-violet-950/40">
    <div className="min-h-0 w-full min-w-0 flex-1 overflow-auto overscroll-y-contain">
      <table className="w-full min-w-0 border-separate border-spacing-0 text-sm table-fixed sm:table-auto sm:min-w-[22rem]">
        <thead className="text-left">
          <tr>
            <SortableTh
              label="Notification"
              columnKey="title"
              activeKey={sortKey}
              sortDir={sortDir}
              onSort={onSort}
            />
            <SortableTh
              label="Time"
              columnKey="createdAt"
              activeKey={sortKey}
              sortDir={sortDir}
              onSort={onSort}
            />
          </tr>
        </thead>
        <tbody className="[&_td]:border-b [&_td]:border-violet-100/80 dark:[&_td]:border-violet-500/15">
          {items.map((n, index) => (
            <tr
              key={n.id}
              style={{ animationDelay: `${Math.min(index, 14) * 40}ms` }}
              className={`patient-slide-in bg-transparent hover:bg-violet-50/60 dark:hover:bg-violet-500/10 ${n.read ? '[&_td]:opacity-[0.55] hover:[&_td]:opacity-100 [&_td]:transition-opacity [&_td]:duration-200' : ''}`}
            >
              <td className="max-w-none px-3 py-3 sm:max-w-[20rem] sm:px-4">
                <div className="flex gap-3">
                  <NotificationBellIcon read={n.read} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900 dark:text-violet-100">{n.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-violet-300/75">
                      {n.message}
                    </p>
                  </div>
                </div>
              </td>
              <td
                className="break-words px-3 py-3 text-xs text-slate-700 sm:whitespace-nowrap sm:px-4 sm:text-sm dark:text-violet-200/90"
                title={moment(n.createdAt).format('llll')}
              >
                {moment(n.createdAt).fromNow()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)
