import type { PatientStarFilter } from '../../lib/patientQuery'
import type { Patient } from '../../types/patient'
import { RecordsFilterSelect } from '../records/RecordsFilterSelect'
import { RecordsToolbar } from '../records/RecordsToolbar'
import { PatientGenderStarredFilterMenu } from './PatientGenderStarredFilterMenu'

const PATIENT_STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'Stable', label: 'Stable' },
  { value: 'Critical', label: 'Critical' },
  { value: 'Recovering', label: 'Recovering' },
] as const

type PatientRecordsToolbarProps = {
  searchQuery: string
  onSearchChange: (value: string) => void
  status: 'all' | Patient['status']
  onStatusChange: (value: 'all' | Patient['status']) => void
  gender: 'all' | Patient['gender']
  onGenderChange: (value: 'all' | Patient['gender']) => void
  starFilter: PatientStarFilter
  onStarFilterChange: (value: PatientStarFilter) => void
  onResetFilters: () => void
  filterResetDisabled?: boolean
  patientView: 'grid' | 'list'
  onPatientViewChange: (view: 'grid' | 'list') => void
}

export const PatientRecordsToolbar = ({
  searchQuery,
  onSearchChange,
  status,
  onStatusChange,
  gender,
  onGenderChange,
  starFilter,
  onStarFilterChange,
  onResetFilters,
  filterResetDisabled = false,
  patientView,
  onPatientViewChange,
}: PatientRecordsToolbarProps) => (
  <RecordsToolbar
    searchInputId="patient-search"
    searchLabelSr="Search patients"
    searchPlaceholder="Search name, email, phone, room, doctor…"
    searchQuery={searchQuery}
    onSearchChange={onSearchChange}
    onResetFilters={onResetFilters}
    filterResetDisabled={filterResetDisabled}
    listView={patientView}
    onListViewChange={onPatientViewChange}
    filters={
      <>
        <RecordsFilterSelect
          value={status}
          onValueChange={(v) => onStatusChange(v as 'all' | Patient['status'])}
          options={PATIENT_STATUS_OPTIONS}
          ariaLabel="Filter by status"
          triggerMinWidthClass="min-w-[8.5rem]"
        />
        <PatientGenderStarredFilterMenu
          gender={gender}
          onGenderChange={onGenderChange}
          starFilter={starFilter}
          onStarFilterChange={onStarFilterChange}
        />
      </>
    }
  />
)
