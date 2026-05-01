import type { Patient } from '../types/patient'

export type PatientSortKey =
  | 'name'
  | 'id'
  | 'email'
  | 'condition'
  | 'attendingDoctor'
  | 'room'
  | 'admissionDate'
  | 'status'
  | 'age'

export type SortDir = 'asc' | 'desc'

export type PatientStarFilter = 'all' | 'starred'

export function filterPatients(
  patients: readonly Patient[],
  query: string,
  status: 'all' | Patient['status'],
  gender: 'all' | Patient['gender'],
  starFilter: PatientStarFilter,
  starredIds: ReadonlySet<string>,
): Patient[] {
  const q = query.trim().toLowerCase()
  return patients.filter((p) => {
    if (status !== 'all' && p.status !== status) return false
    if (gender !== 'all' && p.gender !== gender) return false
    if (starFilter === 'starred' && !starredIds.has(p.id)) return false
    if (!q) return true
    const hay = [
      p.name,
      p.id,
      p.email,
      p.mobile.replace(/\s/g, ''),
      p.condition,
      p.room,
      p.attendingDoctor,
      p.status,
      p.gender,
      String(p.age),
      p.admissionDate,
    ]
      .join(' ')
      .toLowerCase()
    return hay.includes(q)
  })
}

export function sortPatients(
  patients: readonly Patient[],
  key: PatientSortKey,
  dir: SortDir,
): Patient[] {
  const mul = dir === 'asc' ? 1 : -1
  const copy = [...patients]
  copy.sort((a, b) => {
    let cmp = 0
    switch (key) {
      case 'age':
        cmp = a.age - b.age
        break
      case 'admissionDate':
        cmp = a.admissionDate.localeCompare(b.admissionDate)
        break
      case 'name':
        cmp = a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
        break
      case 'id':
        cmp = a.id.localeCompare(b.id, undefined, { numeric: true })
        break
      case 'email':
        cmp = a.email.localeCompare(b.email, undefined, { sensitivity: 'base' })
        break
      case 'condition':
        cmp = a.condition.localeCompare(b.condition, undefined, { sensitivity: 'base' })
        break
      case 'attendingDoctor':
        cmp = a.attendingDoctor.localeCompare(b.attendingDoctor, undefined, { sensitivity: 'base' })
        break
      case 'room':
        cmp = a.room.localeCompare(b.room, undefined, { numeric: true, sensitivity: 'base' })
        break
      case 'status':
        cmp = a.status.localeCompare(b.status)
        break
      default:
        cmp = 0
    }
    return cmp * mul
  })
  return copy
}
