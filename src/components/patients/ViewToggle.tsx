type ViewToggleProps = {
  currentView: 'grid' | 'list'
  onChange: (view: 'grid' | 'list') => void
}

export const ViewToggle = ({ currentView, onChange }: ViewToggleProps) => {
  const base =
    'rounded-md px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-300'

  return (
    <div className="inline-flex gap-2 rounded-lg bg-slate-100 p-1">
      <button
        type="button"
        className={`${base} ${
          currentView === 'grid'
            ? 'bg-white text-blue-700 shadow'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        onClick={() => onChange('grid')}
      >
        Grid View
      </button>
      <button
        type="button"
        className={`${base} ${
          currentView === 'list'
            ? 'bg-white text-blue-700 shadow'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        onClick={() => onChange('list')}
      >
        List View
      </button>
    </div>
  )
}
