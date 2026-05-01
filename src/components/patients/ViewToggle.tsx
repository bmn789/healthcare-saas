type ViewToggleProps = {
  currentView: 'grid' | 'list'
  onChange: (view: 'grid' | 'list') => void
}

export const ViewToggle = ({ currentView, onChange }: ViewToggleProps) => {
  const base =
    'rounded-md px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-violet-300 dark:focus:ring-violet-600'

  return (
    <div className="inline-flex gap-2 rounded-lg border border-violet-200/70 bg-white p-1 shadow-sm shadow-violet-200/20 dark:border-violet-500/20 dark:bg-slate-950 dark:shadow-violet-900/30">
      <button
        type="button"
        className={`${base} ${
          currentView === 'grid'
            ? 'bg-violet-100/80 text-violet-800 shadow-sm dark:bg-violet-500/20 dark:text-violet-200'
            : 'text-slate-700 hover:bg-violet-50 hover:text-violet-800 dark:text-slate-300 dark:hover:bg-violet-500/15 dark:hover:text-violet-200'
        }`}
        onClick={() => onChange('grid')}
      >
        Grid View
      </button>
      <button
        type="button"
        className={`${base} ${
          currentView === 'list'
            ? 'bg-violet-100/80 text-violet-800 shadow-sm dark:bg-violet-500/20 dark:text-violet-200'
            : 'text-slate-700 hover:bg-violet-50 hover:text-violet-800 dark:text-slate-300 dark:hover:bg-violet-500/15 dark:hover:text-violet-200'
        }`}
        onClick={() => onChange('list')}
      >
        List View
      </button>
    </div>
  )
}
