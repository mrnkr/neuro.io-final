export interface SurgeryFilter {
  scheduled: string, // Either today or tomorrow
  pathology: string,
  type: string,
  valid: boolean,
  done: boolean,
  gos: boolean,
  doctor: string
}
