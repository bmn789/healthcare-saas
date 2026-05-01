import type { AppNotification } from '../types/notification'
import type { SortDir } from './patientQuery'

export type NotificationSortKey = 'title' | 'createdAt'

export function filterNotifications(
  items: readonly AppNotification[],
  query: string,
  readFilter: 'all' | 'read' | 'unread',
): AppNotification[] {
  const q = query.trim().toLowerCase()
  return items.filter((n) => {
    if (readFilter === 'read' && !n.read) return false
    if (readFilter === 'unread' && n.read) return false
    if (!q) return true
    const hay = [
      n.id,
      n.title,
      n.message,
      n.severity,
      n.category,
      n.source,
      n.createdAt,
      n.read ? 'read' : 'unread',
    ]
      .join(' ')
      .toLowerCase()
    return hay.includes(q)
  })
}

export function sortNotifications(
  items: readonly AppNotification[],
  key: NotificationSortKey,
  dir: SortDir,
): AppNotification[] {
  const mul = dir === 'asc' ? 1 : -1
  const copy = [...items]
  copy.sort((a, b) => {
    let cmp = 0
    switch (key) {
      case 'title':
        cmp = a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
        break
      case 'createdAt':
        cmp = a.createdAt.localeCompare(b.createdAt)
        break
      default:
        cmp = 0
    }
    return cmp * mul
  })
  return copy
}
