import type { Patient } from '../../types/patient'

export const statusClasses: Record<Patient['status'], string> = {
  Stable:
    'bg-emerald-100/85 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300',
  Recovering:
    'bg-amber-100/85 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300',
  Critical: 'bg-rose-100/85 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300',
}
