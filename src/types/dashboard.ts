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

// ── Roles ──────────────────────────────────────────────────────────────────────
export type UserRole = 'admin' | 'staff' | 'approver' | 'resident'

export type CurrentUser = {
  name: string
  email: string
  role: UserRole
  roleName: string // display label
}

// Which modules each role may access.
// Roles not in this map are treated as no-access.
export const ROLE_MODULE_ACCESS: Record<UserRole, ModuleKey[]> = {
  admin: [
    'resident',
    'household',
    'certificates',
    'blotter',
    'users',
    'reports',
    'onlineRequests',
    'notifications',
    'appointments',
  ],
  staff: [
    'resident',
    'household',
    'certificates',
    'blotter',
    'reports',
    'onlineRequests',
    'notifications',
    'appointments',
  ],
  // Barangay captain / approver: review & approve focused
  approver: [
    'certificates',
    'blotter',
    'onlineRequests',
    'appointments',
    'reports',
    'notifications',
  ],
  // Residents only see their own service-facing modules
  resident: ['onlineRequests', 'appointments', 'notifications'],
}

export function canAccessModule(role: UserRole, module: ModuleKey): boolean {
  return ROLE_MODULE_ACCESS[role].includes(module)
}

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

export type BlotterStatus = 'Filed' | 'Under Investigation' | 'Resolved' | 'Dismissed'

export type BlotterRow = {
  code: string
  complainant: string
  respondent: string
  incident: string
  incidentDetails: string
  incidentDate: string
  status: BlotterStatus
}

export type UserRow = {
  id: string
  name: string
  email: string
  role: UserRole
  status: 'Active' | 'Inactive'
}

export type ReportRow = {
  label: string
  value: string
}

export type RequestStatus = 'Processing' | 'Approved' | 'Rejected' | 'Released'

export type OnlineRequestRow = {
  id: string
  resident: string
  service: string
  submittedAt: string
  status: RequestStatus
}

export type NotificationRow = {
  channel: string
  recipient: string
  message: string
  status: string
}

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled'

export type AppointmentRow = {
  code: string
  resident: string
  service: string
  schedule: string
  status: AppointmentStatus
}
