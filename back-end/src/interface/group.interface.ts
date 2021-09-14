export interface CreateGroup {
  name: string
  number_of_weeks: number
  roll_states: "unmark" | "present" | "absent" | "late"
  incidents: number
  ltmt: "<" | ">"
  student_count: number
}

export interface UpdateGroup {
  id: number
  name: string
  number_of_weeks: number
  roll_states: "unmark" | "present" | "absent" | "late"
  incidents: number
  ltmt: "<" | ">"
  student_count: number
}
