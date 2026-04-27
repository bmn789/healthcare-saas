import type { Patient } from '../../types/patient'

type PatientListProps = {
  patients: Patient[]
}

const statusClasses: Record<Patient['status'], string> = {
  Stable: 'bg-emerald-100 text-emerald-700',
  Recovering: 'bg-amber-100 text-amber-700',
  Critical: 'bg-rose-100 text-rose-700',
}

export const PatientList = ({ patients }: PatientListProps) => (
  <div className="max-w-full overflow-x-auto rounded-lg border border-slate-200">
    <table className="min-w-full divide-y divide-slate-200 text-sm">
      <thead className="bg-slate-50 text-left text-slate-600">
        <tr>
          <th className="px-3 py-2">Patient</th>
          <th className="px-3 py-2">Condition</th>
          <th className="px-3 py-2">Doctor</th>
          <th className="px-3 py-2">Room</th>
          <th className="px-3 py-2">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 bg-white">
        {patients.map((patient) => (
          <tr key={patient.id}>
            <td className="px-3 py-2">
              <p className="font-medium text-slate-900">{patient.name}</p>
              <p className="text-xs text-slate-500">{patient.id}</p>
            </td>
            <td className="px-3 py-2 text-slate-700">{patient.condition}</td>
            <td className="px-3 py-2 text-slate-700">{patient.attendingDoctor}</td>
            <td className="px-3 py-2 text-slate-700">{patient.room}</td>
            <td className="px-3 py-2">
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${statusClasses[patient.status]}`}
              >
                {patient.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
