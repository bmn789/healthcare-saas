import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import type { SortDir } from '../../lib/patientQuery'

/* Opaque backgrounds so sticky headers never pick up parent blur / light bleed in dark mode */
const thBase =
  'sticky top-0 z-[5] whitespace-nowrap border-b border-violet-200 bg-violet-100 px-4 py-3 text-left text-violet-950 shadow-[0_1px_0_0_rgba(167,139,250,0.35)] dark:border-violet-800 dark:bg-slate-900 dark:text-violet-100 dark:shadow-[0_2px_0_0_rgba(0,0,0,0.35)]'

type SortableThProps<T extends string> = {
  label: string
  columnKey: T
  activeKey: T
  sortDir: SortDir
  onSort: (key: T) => void
}

export function SortableTh<T extends string>({
  label,
  columnKey,
  activeKey,
  sortDir,
  onSort,
}: SortableThProps<T>) {
  const active = activeKey === columnKey
  const Icon = !active ? ArrowUpDown : sortDir === 'asc' ? ArrowUp : ArrowDown
  return (
    <th scope="col" className={thBase}>
      <button
        type="button"
        className="group -mx-1 inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-md px-1 py-1 text-left font-semibold text-violet-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 dark:text-violet-100 dark:focus-visible:ring-violet-400/50"
        onClick={() => onSort(columnKey)}
        aria-label={`Sort by ${label}, ${active ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'default'}`}
      >
        {label}
        <Icon
          size={14}
          className={`shrink-0 transition-colors duration-150 ${
            active
              ? 'text-violet-700 group-hover:text-violet-900 dark:text-violet-300 dark:group-hover:text-violet-100'
              : 'text-violet-400/70 group-hover:text-violet-700 dark:text-violet-400/55 dark:group-hover:text-violet-200'
          }`}
          aria-hidden
        />
      </button>
    </th>
  )
}
