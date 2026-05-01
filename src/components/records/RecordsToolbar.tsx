import { Filter, RotateCcw, Search } from 'lucide-react'
import type { ReactNode } from 'react'
import { ViewToggle } from '../patients/ViewToggle'
import { Input } from '../ui/Input'

export type RecordsToolbarProps = {
  searchInputId: string
  searchLabelSr: string
  searchPlaceholder: string
  searchQuery: string
  onSearchChange: (value: string) => void
  onResetFilters: () => void
  filterResetDisabled?: boolean
  resetAriaLabel?: string
  filters: ReactNode
  listView: 'grid' | 'list'
  onListViewChange: (view: 'grid' | 'list') => void
}

const btnBase =
  'inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium outline-none ring-violet-400/35 transition hover:bg-violet-50 focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-40 dark:ring-violet-500/35 dark:hover:bg-violet-500/15'

export const RecordsToolbar = ({
  searchInputId,
  searchLabelSr,
  searchPlaceholder,
  searchQuery,
  onSearchChange,
  onResetFilters,
  filterResetDisabled = false,
  resetAriaLabel = 'Reset search, filters, and column sort',
  filters,
  listView,
  onListViewChange,
}: RecordsToolbarProps) => (
  <div className="flex flex-col gap-3 rounded-xl border border-violet-200/70 bg-white p-3 shadow-sm shadow-violet-200/15 dark:border-violet-500/20 dark:bg-slate-950 dark:shadow-violet-900/20 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
    <div className="relative min-w-0 w-full flex-1 sm:max-w-xl">
      <label htmlFor={searchInputId} className="sr-only">
        {searchLabelSr}
      </label>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-600 opacity-70 dark:text-violet-400"
        aria-hidden
      />
      <Input
        id={searchInputId}
        type="search"
        autoComplete="off"
        placeholder={searchPlaceholder}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="!pl-10"
      />
    </div>

    <div className="flex w-full flex-wrap items-center justify-end gap-3 sm:w-auto">
      <button
        type="button"
        className={`${btnBase} border-violet-200/80 bg-white text-violet-900 dark:border-violet-500/30 dark:bg-slate-900 dark:text-violet-100`}
        onClick={onResetFilters}
        disabled={filterResetDisabled}
        aria-label={resetAriaLabel}
      >
        <RotateCcw size={14} aria-hidden />
        Reset filters
      </button>

      <div
        className="flex flex-wrap items-center gap-2 sm:border-l sm:border-violet-200/70 sm:pl-3 dark:sm:border-violet-500/25"
        aria-label="Filters"
      >
        <Filter size={16} className="hidden shrink-0 text-violet-600 dark:text-violet-400 sm:block" aria-hidden />
        {filters}
      </div>

      <div
        className="flex shrink-0 justify-end sm:border-l sm:border-violet-200/70 sm:pl-3 dark:sm:border-violet-500/25"
        role="group"
        aria-label="Result layout"
      >
        <ViewToggle currentView={listView} onChange={onListViewChange} />
      </div>
    </div>
  </div>
)
