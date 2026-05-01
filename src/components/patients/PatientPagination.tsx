import { ChevronLeft, ChevronRight } from 'lucide-react'

export type PatientPaginationProps = {
  /** 1-based */
  currentPage: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  className?: string
  /** Disable all pagination controls (e.g. while a page transition is in progress). */
  disabled?: boolean
}

/** Page numbers plus `"ellipsis"` markers for gaps when there are many pages. */
function buildPageItems(totalPages: number, currentPage: number): Array<number | 'ellipsis'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const items: Array<number | 'ellipsis'> = []
  const neighbors = new Set([
    1,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ])
  const sorted = [...neighbors].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)

  let prev = 0
  for (const p of sorted) {
    if (prev && p - prev > 1) {
      items.push('ellipsis')
    }
    items.push(p)
    prev = p
  }

  return items
}

export const PatientPagination = ({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  className = '',
  disabled = false,
}: PatientPaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safePage = Math.min(Math.max(1, currentPage), totalPages)
  const start = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1
  const end = Math.min(safePage * pageSize, totalItems)

  const go = (next: number) => {
    if (disabled) return
    const clamped = Math.min(Math.max(1, next), totalPages)
    if (clamped !== currentPage) onPageChange(clamped)
  }

  const pageItems = buildPageItems(totalPages, safePage)

  const pillBase =
    'inline-flex min-h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm font-medium transition disabled:pointer-events-none disabled:opacity-40'

  return (
    <nav
      className={`flex flex-col-reverse gap-3 border-t border-violet-200/60 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-violet-500/20 ${className}`}
      aria-label="Patient list pagination"
      aria-busy={disabled}
    >
      <p className="text-center text-sm text-violet-700/85 dark:text-violet-300/80 sm:text-left">
        {totalItems === 0 ? (
          'No patients to display'
        ) : (
          <>
            Showing <span className="font-semibold tabular-nums text-slate-800 dark:text-violet-100">{start}</span>
            {'–'}
            <span className="font-semibold tabular-nums text-slate-800 dark:text-violet-100">{end}</span> of{' '}
            <span className="font-semibold tabular-nums text-slate-800 dark:text-violet-100">{totalItems}</span>
          </>
        )}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
        <button
          type="button"
          aria-label="Previous page"
          disabled={disabled || safePage <= 1}
          className={`${pillBase} border border-violet-200/80 bg-white text-violet-800 hover:bg-violet-50 dark:border-violet-500/30 dark:bg-slate-900 dark:text-violet-200 dark:hover:bg-violet-500/20`}
          onClick={() => go(safePage - 1)}
        >
          <ChevronLeft size={18} aria-hidden />
        </button>

        <ul className="flex flex-wrap items-center gap-1" role="list">
          {pageItems.map((entry, idx) =>
            entry === 'ellipsis' ? (
              <li key={`ellipsis-${idx}`} className="px-1 text-slate-500 dark:text-violet-400/80" aria-hidden>
                …
              </li>
            ) : (
              <li key={entry}>
                <button
                  type="button"
                  disabled={disabled}
                  className={`${pillBase} ${
                    entry === safePage
                      ? 'bg-violet-600 text-white shadow-sm shadow-violet-400/35 dark:bg-violet-500 dark:shadow-violet-900/40'
                      : 'border border-transparent text-slate-700 hover:bg-violet-100/80 hover:text-violet-900 dark:text-violet-200 dark:hover:bg-violet-500/20 dark:hover:text-violet-100'
                  }`}
                  aria-current={entry === safePage ? 'page' : undefined}
                  aria-label={`Page ${entry}`}
                  onClick={() => go(entry)}
                >
                  {entry}
                </button>
              </li>
            ),
          )}
        </ul>

        <button
          type="button"
          aria-label="Next page"
          disabled={disabled || safePage >= totalPages}
          className={`${pillBase} border border-violet-200/80 bg-white text-violet-800 hover:bg-violet-50 dark:border-violet-500/30 dark:bg-slate-900 dark:text-violet-200 dark:hover:bg-violet-500/20`}
          onClick={() => go(safePage + 1)}
        >
          <ChevronRight size={18} aria-hidden />
        </button>
      </div>
    </nav>
  )
}

export function slicePatientsPage<T>(
  items: readonly T[],
  currentPage: number,
  pageSize: number,
): T[] {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const page = Math.min(Math.max(1, currentPage), totalPages)
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}
