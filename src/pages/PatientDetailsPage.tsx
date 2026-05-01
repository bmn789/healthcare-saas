import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { PatientGrid } from '../components/patients/PatientGrid'
import { PatientList } from '../components/patients/PatientList'
import { PatientPagination, slicePatientsPage } from '../components/patients/PatientPagination'
import { PatientRecordsToolbar } from '../components/patients/PatientRecordsToolbar'
import { PatientGridSkeleton, PatientListSkeleton } from '../components/patients/PatientsSkeleton'
import patients from '../data/patients.json'
import {
  filterPatients,
  type PatientSortKey,
  type PatientStarFilter,
  sortPatients,
  type SortDir,
} from '../lib/patientQuery'
import { useStarredPatientsStore } from '../store/starredPatientsStore'
import { useUIStore } from '../store/uiStore'
import type { Patient } from '../types/patient'

const typedPatients = patients as Patient[]

const INITIAL_LOAD_MS = 500
const PAGE_CHANGE_LOAD_MS = 500
const PAGE_SIZE = 10
function scrollPatientPanelToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export const PatientDetailsPage = () => {
  const patientView = useUIStore((state) => state.patientView)
  const setPatientView = useUIStore((state) => state.setPatientView)
  const starredIds = useStarredPatientsStore((state) => state.ids)
  const [contentReady, setContentReady] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [paginationLoading, setPaginationLoading] = useState(false)
  const paginationTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | Patient['status']>('all')
  const [genderFilter, setGenderFilter] = useState<'all' | Patient['gender']>('all')
  const [starFilter, setStarFilter] = useState<PatientStarFilter>('all')
  const [sort, setSort] = useState<{ key: PatientSortKey; dir: SortDir }>({
    key: 'name',
    dir: 'asc',
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
  }, [patientView, searchQuery, statusFilter, genderFilter, starFilter, sort.key, sort.dir])

  useEffect(() => {
    setPaginationLoading(false)
    if (paginationTimerRef.current) {
      window.clearTimeout(paginationTimerRef.current)
      paginationTimerRef.current = null
    }
  }, [patientView, searchQuery, statusFilter, genderFilter, starFilter, sort.key, sort.dir])

  /* Scroll to top when changing page or grid/list — document handles scroll (sticky app header). */
  useLayoutEffect(() => {
    if (!contentReady) return
    scrollPatientPanelToTop()
  }, [currentPage, patientView, contentReady])

  const starredIdSet = useMemo(() => new Set(starredIds), [starredIds])

  const filteredPatients = useMemo(
    () =>
      filterPatients(typedPatients, searchQuery, statusFilter, genderFilter, starFilter, starredIdSet),
    [searchQuery, statusFilter, genderFilter, starFilter, starredIdSet],
  )

  const sortedPatients = useMemo(
    () => sortPatients(filteredPatients, sort.key, sort.dir),
    [filteredPatients, sort.key, sort.dir],
  )

  const pagePatients =
    sortedPatients.length === 0 ? [] : slicePatientsPage(sortedPatients, currentPage, PAGE_SIZE)

  const handleSort = (key: PatientSortKey) => {
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' },
    )
  }

  const sortIsDefault = sort.key === 'name' && sort.dir === 'asc'
  const filtersAreDefault =
    searchQuery.trim() === '' &&
    statusFilter === 'all' &&
    genderFilter === 'all' &&
    starFilter === 'all'

  const resetFilters = () => {
    setSort({ key: 'name', dir: 'asc' })
    setSearchQuery('')
    setStatusFilter('all')
    setGenderFilter('all')
    setStarFilter('all')
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

  /* Viewport-based height: room for app chrome, main padding, title, toolbar, pagination, gaps (~17.5rem). */
  const listTableShellClass =
    'flex min-h-[min(52dvh,28rem)] flex-col gap-4 lg:h-[calc(100dvh-17.5rem)] lg:max-h-[calc(100dvh-17.5rem)]'

  return (
    <section className="flex min-h-0 flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-violet-100">
          Patient Details
        </h1>
        <p className="text-sm text-violet-700/80 dark:text-violet-300/80">
          View and monitor patient records in grid or list format.
        </p>
      </div>

      <PatientRecordsToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        gender={genderFilter}
        onGenderChange={setGenderFilter}
        starFilter={starFilter}
        onStarFilterChange={setStarFilter}
        onResetFilters={resetFilters}
        filterResetDisabled={filtersAreDefault && sortIsDefault}
        patientView={patientView}
        onPatientViewChange={setPatientView}
      />

      {!contentReady ? (
        patientView === 'grid' ? (
          <PatientGridSkeleton />
        ) : (
          <div className={listTableShellClass}>
            <div className="min-h-0 flex-1 overflow-hidden">
              <PatientListSkeleton />
            </div>
          </div>
        )
      ) : (
        <>
          {sortedPatients.length === 0 ? (
            <>
              <p className="rounded-xl border border-dashed border-violet-300/80 bg-violet-50/50 px-4 py-8 text-center text-sm text-violet-800 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-200">
                No patients match your search or filters. Try adjusting keywords or clearing filters.
              </p>
              <PatientPagination
                currentPage={currentPage}
                pageSize={PAGE_SIZE}
                totalItems={sortedPatients.length}
                onPageChange={handlePageChange}
                disabled={paginationLoading}
                className="shrink-0"
              />
            </>
          ) : patientView === 'grid' ? (
            <>
              {paginationLoading ? <PatientGridSkeleton /> : <PatientGrid patients={pagePatients} />}
              <PatientPagination
                currentPage={currentPage}
                pageSize={PAGE_SIZE}
                totalItems={sortedPatients.length}
                onPageChange={handlePageChange}
                disabled={paginationLoading}
                className="shrink-0"
              />
            </>
          ) : (
            <div className={listTableShellClass}>
              <div className="min-h-0 flex-1 overflow-hidden">
                {paginationLoading ? (
                  <PatientListSkeleton />
                ) : (
                  <PatientList
                    patients={pagePatients}
                    sortKey={sort.key}
                    sortDir={sort.dir}
                    onSort={handleSort}
                  />
                )}
              </div>
              <PatientPagination
                currentPage={currentPage}
                pageSize={PAGE_SIZE}
                totalItems={sortedPatients.length}
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
