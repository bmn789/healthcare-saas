export type Patient = {
  id: string
  name: string
  age: number
  gender: 'Male' | 'Female' | 'Other'
  condition: string
  room: string
  status: 'Stable' | 'Critical' | 'Recovering'
  admissionDate: string
  attendingDoctor: string
}
