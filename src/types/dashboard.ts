export type ModuleKey =
  | 'resident'
  | 'household'
  | 'certificates'
  | 'blotter'
  | 'users'
  | 'reports'
  | 'onlineRequests'
  | 'notifications'
  | 'appointments'

export type Module = {
  key: ModuleKey
  label: string
  description: string
}

export type Theme = 'light' | 'dark'

export type ResidentRow = {
  name: string
  age: number
  purok: string
  status: string
}

export type HouseholdRow = {
  head: string
  members: number
  address: string
  purok: string
}

export type CertificateRow = {
  type: string
  resident: string
  date: string
  status: string
}

export type BlotterRow = {
  code: string
  complainant: string
  incident: string
  status: string
}

export type UserRow = {
  name: string
  role: string
  email: string
  status: string
}

export type ReportRow = {
  label: string
  value: string
}

export type OnlineRequestRow = {
  id: string
  resident: string
  service: string
  submittedAt: string
  status: string
}

export type NotificationRow = {
  channel: string
  recipient: string
  message: string
  status: string
}

export type AppointmentRow = {
  code: string
  resident: string
  service: string
  schedule: string
  status: string
}
