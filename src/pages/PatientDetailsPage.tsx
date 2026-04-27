import { PatientGrid } from '../components/patients/PatientGrid'
import { PatientList } from '../components/patients/PatientList'
import { ViewToggle } from '../components/patients/ViewToggle'
import { patients } from '../data/patients'
import { useUIStore } from '../store/uiStore'

export const PatientDetailsPage = () => {
  const patientView = useUIStore((state) => state.patientView)
  const setPatientView = useUIStore((state) => state.setPatientView)

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Patient Details</h1>
          <p className="text-sm text-slate-500">
            View and monitor patient records in grid or list format.
          </p>
        </div>
        <ViewToggle currentView={patientView} onChange={setPatientView} />
      </div>

      {patientView === 'grid' ? (
        <PatientGrid patients={patients} />
      ) : (
        <PatientList patients={patients} />
      )}
    </section>
  )
}
