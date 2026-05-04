import type {
  AppointmentRow,
  BlotterRow,
  CertificateRow,
  HouseholdRow,
  Module,
  NotificationRow,
  OnlineRequestRow,
  ReportRow,
  ResidentRow,
  UserRow,
} from '../types/dashboard'

export const modules: Module[] = [
  {
    key: 'resident',
    label: 'Resident Management',
    description: 'Manage resident profiles, demographics, and statuses.',
  },
  {
    key: 'household',
    label: 'Household Management',
    description: 'Track household heads, members, and addresses.',
  },
  {
    key: 'certificates',
    label: 'Certificates',
    description: 'Issue Barangay Clearance, Indigency, and other certificates.',
  },
  {
    key: 'blotter',
    label: 'Blotter Records',
    description: 'Log complaints and incidents with status tracking.',
  },
  {
    key: 'users',
    label: 'User Management',
    description: 'Control access for Admin and Staff users.',
  },
  {
    key: 'reports',
    label: 'Reports',
    description: 'View basic statistics and operational summaries.',
  },
  {
    key: 'onlineRequests',
    label: 'Online Request System',
    description: 'Track digital service requests submitted by residents.',
  },
  {
    key: 'notifications',
    label: 'SMS/Email Notifications',
    description: 'Manage outbound notification logs and delivery statuses.',
  },
  {
    key: 'appointments',
    label: 'Appointment Scheduling',
    description: 'Monitor upcoming resident appointments and schedules.',
  },
]

export const statCards = [
  { label: 'Total Residents', value: '1,248' },
  { label: 'Total Households', value: '386' },
  { label: 'Certificates Issued', value: '214' },
  { label: 'Open Blotter Cases', value: '18' },
]

export const residentRows: ResidentRow[] = [
  { name: 'Juan Dela Cruz', age: 38, purok: 'Purok 1', status: 'Active' },
  { name: 'Maria Santos', age: 29, purok: 'Purok 3', status: 'Active' },
  { name: 'Pedro Reyes', age: 66, purok: 'Purok 2', status: 'Senior' },
]

export const householdRows: HouseholdRow[] = [
  { head: 'Dela Cruz Family', members: 5, address: 'Blk 2 Lot 4', purok: 'Purok 1' },
  { head: 'Santos Family', members: 4, address: 'Sitio Riverside', purok: 'Purok 3' },
  { head: 'Reyes Family', members: 3, address: 'Zone 5', purok: 'Purok 2' },
]

export const certificateRows: CertificateRow[] = [
  {
    type: 'Barangay Clearance',
    resident: 'Juan Dela Cruz',
    date: '2026-04-19',
    status: 'Released',
  },
  {
    type: 'Indigency',
    resident: 'Ana Villanueva',
    date: '2026-04-20',
    status: 'Processing',
  },
  {
    type: 'Residency',
    resident: 'Mark Gonzales',
    date: '2026-04-21',
    status: 'For Pickup',
  },
]

export const blotterRows: BlotterRow[] = [
  {
    code: 'BLT-2026-031',
    complainant: 'R. Flores',
    respondent: 'A. Ramos',
    incident: 'Noise Complaint',
    incidentDetails: 'Loud karaoke past midnight in Purok 3, affecting neighboring households.',
    incidentDate: '2026-04-18',
    status: 'Filed',
  },
  {
    code: 'BLT-2026-028',
    complainant: 'J. Rivera',
    respondent: 'P. Gutierrez',
    incident: 'Boundary Dispute',
    incidentDetails: 'Respondent allegedly encroached on complainant property boundary by 2 meters.',
    incidentDate: '2026-04-10',
    status: 'Under Investigation',
  },
  {
    code: 'BLT-2026-017',
    complainant: 'M. Cruz',
    respondent: 'L. Villanueva',
    incident: 'Public Disturbance',
    incidentDetails: 'Verbal altercation in public market that escalated to shoving.',
    incidentDate: '2026-03-29',
    status: 'Resolved',
  },
]

export const userRows: UserRow[] = [
  {
    id: 'user-001',
    name: 'Barangay Admin',
    role: 'admin',
    email: 'admin@barangay.gov.ph',
    status: 'Active',
  },
  {
    id: 'user-002',
    name: 'Records Staff 1',
    role: 'staff',
    email: 'staff1@barangay.gov.ph',
    status: 'Active',
  },
  {
    id: 'user-003',
    name: 'Records Staff 2',
    role: 'staff',
    email: 'staff2@barangay.gov.ph',
    status: 'Inactive',
  },
  {
    id: 'user-004',
    name: 'Barangay Captain',
    role: 'approver',
    email: 'captain@barangay.gov.ph',
    status: 'Active',
  },
]

export const reportRows: ReportRow[] = [
  { label: 'Residents by Purok', value: 'P1: 312, P2: 289, P3: 401, P4: 246' },
  { label: 'Certificates This Month', value: '214 requests processed' },
  { label: 'Cases Resolved Rate', value: '81% resolved within 7 days' },
]

export const onlineRequestRows: OnlineRequestRow[] = [
  {
    id: 'OR-2026-041',
    resident: 'Lea Domingo',
    service: 'Barangay Clearance',
    submittedAt: '2026-04-21 09:15',
    status: 'Processing',
  },
  {
    id: 'OR-2026-040',
    resident: 'Rico Mendiola',
    service: 'Indigency Certificate',
    submittedAt: '2026-04-21 08:43',
    status: 'For Pickup',
  },
  {
    id: 'OR-2026-039',
    resident: 'Nina Vergara',
    service: 'Residency Certificate',
    submittedAt: '2026-04-20 17:06',
    status: 'Released',
  },
]

export const notificationRows: NotificationRow[] = [
  {
    channel: 'SMS',
    recipient: 'Juan Dela Cruz',
    message: 'Your Barangay Clearance is ready for pickup.',
    status: 'Sent',
  },
  {
    channel: 'Email',
    recipient: 'Maria Santos',
    message: 'Appointment reminder for April 23, 2026.',
    status: 'Delivered',
  },
  {
    channel: 'SMS',
    recipient: 'Ana Villanueva',
    message: 'Please update missing requirements.',
    status: 'Failed',
  },
]

export const appointmentRows: AppointmentRow[] = [
  {
    code: 'APT-2026-014',
    resident: 'Carlos Lim',
    service: 'Business Permit Endorsement',
    schedule: '2026-04-22 10:00 AM',
    status: 'Confirmed',
  },
  {
    code: 'APT-2026-015',
    resident: 'Jenica Ramos',
    service: 'Certificate Claim',
    schedule: '2026-04-22 02:00 PM',
    status: 'Pending',
  },
  {
    code: 'APT-2026-016',
    resident: 'Paolo Dizon',
    service: 'Blotter Follow-up',
    schedule: '2026-04-23 09:30 AM',
    status: 'Completed',
  },
]

export const quickActions = [
  'Add Resident',
  'Create Household',
  'Issue Certificate',
  'Record Blotter',
  'Add User',
  'Schedule Appointment',
  'Approve Online Request',
]

export const recentActivity = [
  'New certificate request for Barangay Clearance',
  'Blotter case BLT-2026-031 marked Open',
  'Resident profile for Maria Santos updated',
  'Monthly summary report generated',
]

export const statusStyles: Record<string, string> = {
  Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  Senior: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300',
  Released: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  Processing: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  'For Pickup': 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300',
  Open: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
  Filed: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  'Under Investigation': 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300',
  Resolved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  Dismissed: 'bg-slate-200 text-slate-700 dark:bg-slate-600/40 dark:text-slate-200',
  Mediation: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  Inactive: 'bg-slate-200 text-slate-700 dark:bg-slate-600/40 dark:text-slate-200',
  Sent: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  Delivered: 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300',
  Failed: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
  Confirmed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  Completed: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300',
  Rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
  Approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  Cancelled: 'bg-slate-200 text-slate-700 dark:bg-slate-600/40 dark:text-slate-200',
}
