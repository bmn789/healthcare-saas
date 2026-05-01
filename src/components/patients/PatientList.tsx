import { useState } from 'react'
import { Mail, Phone } from 'lucide-react'
import type { PatientSortKey, SortDir } from '../../lib/patientQuery'
import type { Patient } from '../../types/patient'
import { PatientStarButton } from './PatientStarButton'
import { SortableTh } from '../records/SortableTh'
import { statusClasses } from './statusStyles'

/* Match SortableTh sticky header for the leading star column */
const starThClass =
  'sticky top-0 z-[5] min-w-[2.75rem] border-b border-violet-200 bg-violet-100 px-2 py-3 text-center text-violet-950 shadow-[0_1px_0_0_rgba(167,139,250,0.35)] dark:border-violet-800 dark:bg-slate-900 dark:text-violet-100 dark:shadow-[0_2px_0_0_rgba(0,0,0,0.35)]'

type PatientListProps = {
  patients: Patient[]
  sortKey: PatientSortKey
  sortDir: SortDir
  onSort: (key: PatientSortKey) => void
}

function RowPhoto({ patient }: { patient: Patient }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-200/90 text-xs font-semibold text-violet-800 dark:bg-violet-500/30 dark:text-violet-200"
        aria-label={patient.name}
      >
        {patient.name
          .split(/\s+/)
          .map((p) => p[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()}
      </div>
    )
  }
  return (
    <img
      src={patient.photoUrl}
      alt={patient.name}
      width={40}
      height={40}
      loading="lazy"
      decoding="async"
      className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-violet-200/70 dark:ring-violet-500/35"
      onError={() => setFailed(true)}
    />
  )
}

export const PatientList = ({ patients, sortKey, sortDir, onSort }: PatientListProps) => (
  <div className="flex h-full min-h-0 w-full max-w-full flex-col overflow-hidden rounded-xl border border-violet-200/80 bg-white shadow-sm shadow-violet-200/25 dark:border-violet-500/40 dark:bg-slate-950 dark:shadow-violet-950/40">
    <div className="min-h-0 flex-1 overflow-auto overscroll-y-contain">
      <table className="min-w-[58rem] border-separate border-spacing-0 text-sm">
      <thead className="text-left">
        <tr>
          <th scope="col" className={starThClass}>
            <span className="sr-only">Star patient</span>
          </th>
          <SortableTh label="Patient" columnKey="name" activeKey={sortKey} sortDir={sortDir} onSort={onSort} />
          <SortableTh label="Contact" columnKey="email" activeKey={sortKey} sortDir={sortDir} onSort={onSort} />
          <SortableTh label="Condition" columnKey="condition" activeKey={sortKey} sortDir={sortDir} onSort={onSort} />
          <SortableTh
            label="Doctor"
            columnKey="attendingDoctor"
            activeKey={sortKey}
            sortDir={sortDir}
            onSort={onSort}
          />
          <SortableTh label="Room" columnKey="room" activeKey={sortKey} sortDir={sortDir} onSort={onSort} />
          <SortableTh label="Admitted" columnKey="admissionDate" activeKey={sortKey} sortDir={sortDir} onSort={onSort} />
          <SortableTh label="Status" columnKey="status" activeKey={sortKey} sortDir={sortDir} onSort={onSort} />
        </tr>
      </thead>
      <tbody className="[&_td]:border-b [&_td]:border-violet-100/80 dark:[&_td]:border-violet-500/15">
        {patients.map((patient, index) => (
          <tr
            key={patient.id}
            style={{ animationDelay: `${Math.min(index, 14) * 40}ms` }}
            className="patient-slide-in bg-transparent hover:bg-violet-50/60 dark:hover:bg-violet-500/10"
          >
            <td className="px-2 py-3 text-center align-middle">
              <PatientStarButton patientId={patient.id} />
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                <RowPhoto patient={patient} />
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 dark:text-violet-100">{patient.name}</p>
                  <p className="font-mono text-xs text-violet-700/80 dark:text-violet-400/85">{patient.id}</p>
                  <p className="text-xs text-slate-500 dark:text-violet-300/70">
                    {patient.age} · {patient.gender}
                  </p>
                </div>
              </div>
            </td>
            <td className="px-4 py-3">
              <div className="flex min-w-[12rem] flex-col gap-1.5 text-slate-700 dark:text-violet-200/90">
                <span className="inline-flex items-start gap-1.5 break-all">
                  <Mail size={14} className="mt-0.5 shrink-0 text-violet-600 opacity-85 dark:text-violet-400" aria-hidden />
                  <a href={`mailto:${patient.email}`} className="hover:underline">
                    {patient.email}
                  </a>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Phone size={14} className="shrink-0 text-violet-600 opacity-85 dark:text-violet-400" aria-hidden />
                  <a href={`tel:${patient.mobile.replace(/\s/g, '')}`} className="whitespace-nowrap hover:underline">
                    {patient.mobile}
                  </a>
                </span>
              </div>
            </td>
            <td className="px-4 py-3 text-slate-700 dark:text-violet-200/90">{patient.condition}</td>
            <td className="px-4 py-3 text-slate-700 dark:text-violet-200/90">{patient.attendingDoctor}</td>
            <td className="px-4 py-3 text-slate-700 dark:text-violet-200/90">{patient.room}</td>
            <td className="px-4 py-3 text-slate-700 dark:text-violet-200/90">{patient.admissionDate}</td>
            <td className="px-4 py-3">
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClasses[patient.status]}`}
              >
                {patient.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  </div>
)
