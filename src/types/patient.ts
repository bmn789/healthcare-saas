export type Patient = {
  id: string
  name: string
  photoUrl: string
  email: string
  mobile: string
  age: number
  gender: 'Male' | 'Female' | 'Other'
  condition: string
  room: string
  status: 'Stable' | 'Critical' | 'Recovering'
  admissionDate: string
  attendingDoctor: string
}
