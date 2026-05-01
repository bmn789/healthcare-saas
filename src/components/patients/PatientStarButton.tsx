import { Star } from 'lucide-react'
import { useStarredPatientsStore } from '../../store/starredPatientsStore'

type PatientStarButtonProps = {
  patientId: string
  className?: string
}

const btnClass =
  'inline-flex shrink-0 items-center justify-center rounded-lg p-1.5 text-slate-500 outline-none ring-violet-400/40 transition hover:bg-violet-100/80 hover:text-amber-500 focus-visible:ring-2 dark:text-violet-400/80 dark:hover:bg-violet-500/20 dark:hover:text-amber-400'

export const PatientStarButton = ({ patientId, className = '' }: PatientStarButtonProps) => {
  const isStarred = useStarredPatientsStore((s) => s.ids.includes(patientId))
  const toggle = useStarredPatientsStore((s) => s.toggle)
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        toggle(patientId)
      }}
      className={`${btnClass} ${className}`.trim()}
      aria-label={isStarred ? 'Remove from starred patients' : 'Star patient'}
      aria-pressed={isStarred}
    >
      <Star
        size={18}
        className={
          isStarred
            ? 'fill-amber-400 text-amber-500 dark:fill-amber-400/90 dark:text-amber-300'
            : 'text-current'
        }
        aria-hidden
      />
    </button>
  )
}
