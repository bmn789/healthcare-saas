import { useState } from 'react'
import {
  Activity,
  BedDouble,
  Calendar,
  HeartPulse,
  Mail,
  Phone,
  Stethoscope,
  UserRound,
} from 'lucide-react'
import type { Patient } from '../../types/patient'
import { PatientStarButton } from './PatientStarButton'
import { statusClasses } from './statusStyles'

type PatientGridProps = {
  patients: Patient[]
}

function PatientPhoto({ patient }: { patient: Patient }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="relative h-16 w-16 shrink-0">
      {failed ? (
        <div
          className="flex h-full w-full items-center justify-center rounded-full bg-violet-200/90 text-lg font-semibold text-violet-800 ring-2 ring-violet-300/60 dark:bg-violet-500/30 dark:text-violet-200 dark:ring-violet-500/40"
          aria-label={patient.name}
        >
          {patient.name
            .split(/\s+/)
            .map((p) => p[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()}
        </div>
      ) : (
        <img
          src={patient.photoUrl}
          alt={patient.name}
          width={64}
          height={64}
          loading="lazy"
          decoding="async"
          className="h-16 w-16 rounded-full object-cover ring-2 ring-violet-200/80 ring-offset-2 ring-offset-white dark:ring-violet-500/40 dark:ring-offset-slate-950"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}

export const PatientGrid = ({ patients }: PatientGridProps) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {patients.map((patient, index) => (
      <article
        key={patient.id}
        style={{ animationDelay: `${index * 55}ms` }}
        className="patient-slide-in rounded-xl border border-violet-200/70 bg-gradient-to-b from-white/90 to-white/60 p-4 shadow-sm shadow-violet-200/25 backdrop-blur-sm transition-shadow duration-300 hover:shadow-md hover:shadow-violet-300/25 dark:border-violet-500/20 dark:from-slate-950/85 dark:to-slate-950/55 dark:shadow-violet-950/30 dark:hover:shadow-violet-900/40"
      >
        <div className="flex gap-4">
          <PatientPhoto patient={patient} />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold text-slate-900 dark:text-violet-100">{patient.name}</h3>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-violet-700/85 dark:text-violet-300/80">
                  <span className="inline-flex items-center gap-1 font-mono text-[0.7rem] text-slate-600 dark:text-violet-400/90">
                    <UserRound size={12} className="shrink-0 opacity-80" aria-hidden />
                    {patient.id}
                  </span>
                  <span>
                    {patient.age} · {patient.gender}
                  </span>
                </p>
              </div>
              <div className="flex shrink-0 items-start">
                <PatientStarButton patientId={patient.id} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2.5 border-t border-violet-100/90 pt-4 text-sm dark:border-violet-500/15">
          <p className="flex items-start gap-2.5 text-slate-700 dark:text-violet-200/90">
            <Mail
              size={16}
              className="mt-0.5 shrink-0 text-violet-600 opacity-80 dark:text-violet-400"
              aria-hidden
            />
            <a href={`mailto:${patient.email}`} className="min-w-0 break-all text-left hover:underline">
              {patient.email}
            </a>
          </p>
          <p className="flex items-center gap-2.5 text-slate-700 dark:text-violet-200/90">
            <Phone size={16} className="shrink-0 text-violet-600 opacity-80 dark:text-violet-400" aria-hidden />
            <a href={`tel:${patient.mobile.replace(/\s/g, '')}`} className="hover:underline">
              {patient.mobile}
            </a>
          </p>
          <p className="flex items-center gap-2.5 text-slate-700 dark:text-violet-200/90">
            <Activity size={16} className="shrink-0 text-violet-600 opacity-80 dark:text-violet-400" aria-hidden />
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClasses[patient.status]}`}
            >
              {patient.status}
            </span>
          </p>
          <p className="flex items-center gap-2.5 text-slate-700 dark:text-violet-200/90">
            <HeartPulse size={16} className="shrink-0 text-violet-600 opacity-80 dark:text-violet-400" aria-hidden />
            <span>{patient.condition}</span>
          </p>
          <p className="flex items-center gap-2.5 text-slate-700 dark:text-violet-200/90">
            <Stethoscope size={16} className="shrink-0 text-violet-600 opacity-80 dark:text-violet-400" aria-hidden />
            <span>{patient.attendingDoctor}</span>
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-slate-700 dark:text-violet-200/90">
            <span className="inline-flex items-center gap-2">
              <BedDouble size={16} className="shrink-0 text-violet-600 opacity-80 dark:text-violet-400" aria-hidden />
              {patient.room}
            </span>
            <span className="inline-flex items-center gap-2">
              <Calendar size={16} className="shrink-0 text-violet-600 opacity-80 dark:text-violet-400" aria-hidden />
              Admitted {patient.admissionDate}
            </span>
          </div>
        </div>
      </article>
    ))}
  </div>
)
