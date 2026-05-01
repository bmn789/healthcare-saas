import { BellRing } from 'lucide-react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { NotificationGrid } from '../components/notifications/NotificationGrid'
import { NotificationList } from '../components/notifications/NotificationList'
import { PatientGridSkeleton, PatientListSkeleton } from '../components/patients/PatientsSkeleton'
import { RecordsFilterSelect } from '../components/records/RecordsFilterSelect'
import { RecordsToolbar } from '../components/records/RecordsToolbar'
import { PatientPagination, slicePatientsPage } from '../components/patients/PatientPagination'
import notificationsJson from '../data/notifications.json'
import { filterNotifications, type NotificationSortKey, sortNotifications } from '../lib/notificationQuery'
import type { SortDir } from '../lib/patientQuery'
import { serviceWorkerScope, serviceWorkerUrl } from '../lib/serviceWorker'
import { useUIStore } from '../store/uiStore'
import type { AppNotification } from '../types/notification'

const typedNotifications = notificationsJson as AppNotification[]

const INITIAL_LOAD_MS = 500
const PAGE_CHANGE_LOAD_MS = 500
const PAGE_SIZE = 10

const NOTIFICATION_READ_OPTIONS = [
  { value: 'all', label: 'All items' },
  { value: 'unread', label: 'Unread' },
  { value: 'read', label: 'Read' },
] as const

function scrollNotificationsToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const triggerLocalNotification = async () => {
  if (!('Notification' in window)) {
    alert('Notifications are not supported in this browser.')
    return
  }

  try {
    const permission =
      Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission()

    if (permission !== 'granted') {
      alert('Notification permission is required to trigger alerts.')
      return
    }

    const payload = {
      body: 'Room ICU-12 requires nurse follow-up in the next 10 minutes.',
      icon: `${import.meta.env.BASE_URL}favicon.svg`,
      tag: 'critical-patient-reminder',
    }

    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register(serviceWorkerUrl(), {
          scope: serviceWorkerScope(),
        })
        await navigator.serviceWorker.ready

        try {
          await registration.showNotification('Critical Patient Reminder', payload)
          return
        } catch {
          /* Fall back to window.Notification when service worker delivery fails */
        }
      } catch {
        /* Registration failed; still try legacy notification */
      }
    }

    new Notification('Critical Patient Reminder', payload)
  } catch (error) {
    console.error('Unable to trigger notification:', error)
    alert('Unable to trigger notification. Please try again.')
  }
}

export const NotificationsPage = () => {
  const notificationView = useUIStore((s) => s.notificationView)
  const setNotificationView = useUIStore((s) => s.setNotificationView)

  const [contentReady, setContentReady] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [paginationLoading, setPaginationLoading] = useState(false)
  const paginationTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [readFilter, setReadFilter] = useState<'all' | 'read' | 'unread'>('all')
  const [sort, setSort] = useState<{ key: NotificationSortKey; dir: SortDir }>({
    key: 'createdAt',
    dir: 'desc',
  })

  useEffect(() => {
    const id = window.setTimeout(() => setContentReady(true), INITIAL_LOAD_MS)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    return () => {
      if (paginationTimerRef.current) window.clearTimeout(paginationTimerRef.current)
    }
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [notificationView, searchQuery, readFilter, sort.key, sort.dir])

  useEffect(() => {
    setPaginationLoading(false)
    if (paginationTimerRef.current) {
      window.clearTimeout(paginationTimerRef.current)
      paginationTimerRef.current = null
    }
  }, [notificationView, searchQuery, readFilter, sort.key, sort.dir])

  useLayoutEffect(() => {
    if (!contentReady) return
    scrollNotificationsToTop()
  }, [currentPage, notificationView, contentReady])

  const filtered = useMemo(
    () => filterNotifications(typedNotifications, searchQuery, readFilter),
    [searchQuery, readFilter],
  )

  const sorted = useMemo(
    () => sortNotifications(filtered, sort.key, sort.dir),
    [filtered, sort.key, sort.dir],
  )

  const pageItems =
    sorted.length === 0 ? [] : slicePatientsPage(sorted, currentPage, PAGE_SIZE)

  const handleSort = (key: NotificationSortKey) => {
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' },
    )
  }

  const sortIsDefault = sort.key === 'createdAt' && sort.dir === 'desc'
  const filtersAreDefault = searchQuery.trim() === '' && readFilter === 'all'

  const resetFilters = () => {
    setSort({ key: 'createdAt', dir: 'desc' })
    setSearchQuery('')
    setReadFilter('all')
  }

  const handlePageChange = (page: number) => {
    if (page === currentPage) return
    if (paginationTimerRef.current) {
      window.clearTimeout(paginationTimerRef.current)
      paginationTimerRef.current = null
    }
    setCurrentPage(page)
    setPaginationLoading(true)
    paginationTimerRef.current = window.setTimeout(() => {
      setPaginationLoading(false)
      paginationTimerRef.current = null
    }, PAGE_CHANGE_LOAD_MS)
  }

  const listTableShellClass =
    'flex min-h-[min(52dvh,28rem)] min-w-0 w-full flex-col gap-4 lg:h-[calc(100dvh-17.5rem)] lg:max-h-[calc(100dvh-17.5rem)]'

  return (
    <section className="flex min-h-0 flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-violet-100">Notifications</h1>
        <p className="text-sm text-violet-700/80 dark:text-violet-300/80">
          Review operational alerts and test local notification delivery — same controls as Patient
          Details.
        </p>
      </div>

      <div className="rounded-xl border border-violet-200/70 bg-white/70 p-5 shadow-sm shadow-violet-200/15 backdrop-blur-sm dark:border-violet-500/20 dark:bg-slate-950/50 dark:shadow-violet-900/20">
        <div className="mb-4 flex items-center gap-2 text-violet-800 dark:text-violet-200">
          <BellRing size={18} aria-hidden />
          <p className="text-sm font-medium">Critical patient reminder test</p>
        </div>
        <p className="mb-5 text-sm text-violet-700/90 dark:text-violet-300/85">
          Sends a local browser notification using service worker support when available.
        </p>
        <button
          type="button"
          onClick={() => void triggerLocalNotification()}
          className="rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-violet-400/30 hover:from-violet-500 hover:to-indigo-500"
        >
          Trigger Notification
        </button>
      </div>

      <RecordsToolbar
        searchInputId="notifications-search"
        searchLabelSr="Search notifications"
        searchPlaceholder="Search notifications…"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onResetFilters={resetFilters}
        filterResetDisabled={filtersAreDefault && sortIsDefault}
        listView={notificationView}
        onListViewChange={setNotificationView}
        filters={
          <RecordsFilterSelect
            value={readFilter}
            onValueChange={(v) => setReadFilter(v as 'all' | 'read' | 'unread')}
            options={NOTIFICATION_READ_OPTIONS}
            ariaLabel="Filter by read state"
            triggerMinWidthClass="min-w-[7.75rem]"
          />
        }
      />

      {!contentReady ? (
        notificationView === 'grid' ? (
          <PatientGridSkeleton />
        ) : (
          <div className={listTableShellClass}>
            <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
              <PatientListSkeleton />
            </div>
          </div>
        )
      ) : (
        <>
          {sorted.length === 0 ? (
            <>
              <p className="rounded-xl border border-dashed border-violet-300/80 bg-violet-50/50 px-4 py-8 text-center text-sm text-violet-800 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-200">
                No notifications match your search or filters. Try adjusting keywords or clearing
                filters.
              </p>
              <PatientPagination
                currentPage={currentPage}
                pageSize={PAGE_SIZE}
                totalItems={sorted.length}
                onPageChange={handlePageChange}
                disabled={paginationLoading}
                className="shrink-0"
              />
            </>
          ) : notificationView === 'grid' ? (
            <>
              {paginationLoading ? <PatientGridSkeleton /> : <NotificationGrid items={pageItems} />}
              <PatientPagination
                currentPage={currentPage}
                pageSize={PAGE_SIZE}
                totalItems={sorted.length}
                onPageChange={handlePageChange}
                disabled={paginationLoading}
                className="shrink-0"
              />
            </>
          ) : (
            <div className={listTableShellClass}>
              <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
                {paginationLoading ? (
                  <PatientListSkeleton />
                ) : (
                  <NotificationList
                    items={pageItems}
                    sortKey={sort.key}
                    sortDir={sort.dir}
                    onSort={handleSort}
                  />
                )}
              </div>
              <PatientPagination
                currentPage={currentPage}
                pageSize={PAGE_SIZE}
                totalItems={sorted.length}
                onPageChange={handlePageChange}
                disabled={paginationLoading}
                className="shrink-0"
              />
            </div>
          )}
        </>
      )}
    </section>
  )
}
