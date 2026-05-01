import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Check, ChevronDown } from 'lucide-react'
import type { PatientStarFilter } from '../../lib/patientQuery'
import type { Patient } from '../../types/patient'

function genderSummary(gender: 'all' | Patient['gender']): string {
  return gender === 'all' ? 'All genders' : gender
}

function starSummary(starFilter: PatientStarFilter): string {
  return starFilter === 'starred' ? 'Starred only' : 'All patients'
}

function triggerLabel(
  gender: 'all' | Patient['gender'],
  starFilter: PatientStarFilter,
): string {
  if (gender === 'all' && starFilter === 'all') return 'ALL'
  return `${genderSummary(gender)} · ${starSummary(starFilter)}`
}

const triggerClass =
  'inline-flex min-w-[11rem] max-w-full items-center justify-between gap-2 rounded-lg border border-violet-200/80 bg-white/90 px-3 py-2 text-left text-sm text-slate-800 outline-none ring-violet-400/30 transition hover:bg-violet-50/80 focus-visible:ring-2 dark:border-violet-500/30 dark:bg-slate-900/80 dark:text-violet-100 dark:hover:bg-violet-500/10 dark:focus-visible:ring-violet-400/35 [&[data-state=open]>svg:last-child]:rotate-180'

const contentClass =
  'z-[60] max-h-[min(24rem,calc(100dvh-5rem))] w-[min(15rem,calc(100vw-2rem))] overflow-y-auto rounded-lg border border-violet-200/70 bg-white/95 py-1 shadow-xl shadow-violet-200/30 backdrop-blur-sm dark:border-violet-500/30 dark:bg-slate-950/95 dark:shadow-violet-900/20'

const sectionLabelClass =
  'select-none px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-violet-700/85 dark:text-violet-400/90'

const radioItemClass =
  'relative mx-1 flex cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-3 text-sm text-slate-800 outline-none transition-colors hover:bg-violet-50 data-[highlighted]:bg-violet-50 dark:text-violet-100 dark:data-[highlighted]:bg-violet-500/15'

const separatorClass = 'my-1 h-px bg-violet-100 dark:bg-violet-500/20'

const radioIndicatorWrap = 'absolute left-2.5 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center'

type PatientGenderStarredFilterMenuProps = {
  gender: 'all' | Patient['gender']
  onGenderChange: (value: 'all' | Patient['gender']) => void
  starFilter: PatientStarFilter
  onStarFilterChange: (value: PatientStarFilter) => void
}

export const PatientGenderStarredFilterMenu = ({
  gender,
  onGenderChange,
  starFilter,
  onStarFilterChange,
}: PatientGenderStarredFilterMenuProps) => (
  <DropdownMenu.Root modal={false}>
    <DropdownMenu.Trigger type="button" className={triggerClass} aria-label="Filter patients by gender and starred">
      <span className="min-w-0 flex-1 truncate">
        <span className="text-slate-800 dark:text-violet-100">{triggerLabel(gender, starFilter)}</span>
      </span>
      <ChevronDown
        size={16}
        className="shrink-0 text-violet-600 opacity-85 transition-transform duration-200 dark:text-violet-400"
        aria-hidden
      />
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content sideOffset={6} align="start" className={contentClass}>
        <DropdownMenu.Label className={sectionLabelClass}>Gender</DropdownMenu.Label>
        <DropdownMenu.RadioGroup
          value={gender === 'all' ? undefined : gender}
          onValueChange={(value) => {
            if (value !== 'Male' && value !== 'Female' && value !== 'Other') return
            if (value === gender) onGenderChange('all')
            else onGenderChange(value)
          }}
        >
          <DropdownMenu.RadioItem value="Male" className={radioItemClass}>
            <span className={radioIndicatorWrap} aria-hidden>
              <DropdownMenu.ItemIndicator>
                <Check size={14} className="text-violet-600 dark:text-violet-400" strokeWidth={2.5} />
              </DropdownMenu.ItemIndicator>
            </span>
            Male
          </DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="Female" className={radioItemClass}>
            <span className={radioIndicatorWrap} aria-hidden>
              <DropdownMenu.ItemIndicator>
                <Check size={14} className="text-violet-600 dark:text-violet-400" strokeWidth={2.5} />
              </DropdownMenu.ItemIndicator>
            </span>
            Female
          </DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="Other" className={radioItemClass}>
            <span className={radioIndicatorWrap} aria-hidden>
              <DropdownMenu.ItemIndicator>
                <Check size={14} className="text-violet-600 dark:text-violet-400" strokeWidth={2.5} />
              </DropdownMenu.ItemIndicator>
            </span>
            Other
          </DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>

        <DropdownMenu.Separator className={separatorClass} />

        <DropdownMenu.Label className={sectionLabelClass}>Patients</DropdownMenu.Label>
        <DropdownMenu.RadioGroup
          value={starFilter === 'starred' ? 'starred' : undefined}
          onValueChange={(value) => {
            if (value !== 'starred') return
            if (starFilter === 'starred') onStarFilterChange('all')
            else onStarFilterChange('starred')
          }}
        >
          <DropdownMenu.RadioItem value="starred" className={radioItemClass}>
            <span className={radioIndicatorWrap} aria-hidden>
              <DropdownMenu.ItemIndicator>
                <Check size={14} className="text-violet-600 dark:text-violet-400" strokeWidth={2.5} />
              </DropdownMenu.ItemIndicator>
            </span>
            Starred only
          </DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
)
