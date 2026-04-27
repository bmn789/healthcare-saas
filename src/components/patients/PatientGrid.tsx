import type { Patient } from '../../types/patient'

type PatientGridProps = {
  patients: Patient[]
}

const statusClasses: Record<Patient['status'], string> = {
  Stable: 'bg-emerald-100 text-emerald-700',
  Recovering: 'bg-amber-100 text-amber-700',
  Critical: 'bg-rose-100 text-rose-700',
}

export const PatientGrid = ({ patients }: PatientGridProps) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {patients.map((patient) => (
      <article
        key={patient.id}
        className="rounded-lg border border-slate-200 bg-slate-50 p-4"
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">{patient.name}</h3>
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${statusClasses[patient.status]}`}
          >
            {patient.status}
          </span>
        </div>
        <div className="space-y-1 text-sm text-slate-600">
          <p>Patient ID: {patient.id}</p>
          <p>Condition: {patient.condition}</p>
          <p>Doctor: {patient.attendingDoctor}</p>
          <p>Room: {patient.room}</p>
          <p>Admitted: {patient.admissionDate}</p>
        </div>
      </article>
    ))}
  </div>
)
