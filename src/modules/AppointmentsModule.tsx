import { useEffect, useMemo, useState } from 'react'
import { statusStyles } from '../data/dashboardData'
import { DataTable, StatusBadge, type ColumnDef } from '../components/DataTable'
import { useAppointmentsModule } from '../composables/useAppointmentsModule'
import { AppointmentFormModal } from '../components/modals/AppointmentFormModal'
import { DeleteConfirmationDialog } from '../components/modals/DeleteConfirmationDialog'
import type { AppointmentRow, AppointmentStatus } from '../types/dashboard'

/** Custom event name used by Quick Actions to open the Schedule Appointment modal. */
export const SCHEDULE_APPOINTMENT_EVENT = 'open-schedule-appointment-modal'

export function AppointmentsModule() {
  const {
    items,
    isLoading,
    error,
    isSubmitting,
    scheduleAppointment,
    updateStatus,
    updateItem,
    deleteItem,
  } = useAppointmentsModule()

  // ── Modal state ────────────────────────────────────────────────────────────
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<AppointmentRow | null>(null)

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingAppointment, setDeletingAppointment] = useState<AppointmentRow | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // ── Listen for external "Schedule Appointment" trigger (Quick Actions) ─────────
  useEffect(() => {
    function handleExternalSchedule() {
      setEditingAppointment(null)
      setIsFormOpen(true)
    }
    window.addEventListener(SCHEDULE_APPOINTMENT_EVENT, handleExternalSchedule)
    return () => window.removeEventListener(SCHEDULE_APPOINTMENT_EVENT, handleExternalSchedule)
  }, [])

  // ── Handlers ───────────────────────────────────────────────────────────────
  function openScheduleModal() {
    setEditingAppointment(null)
    setIsFormOpen(true)
  }

  function openEditModal(appointment: AppointmentRow) {
    setEditingAppointment(appointment)
    setIsFormOpen(true)
  }

  function openDeleteDialog(appointment: AppointmentRow) {
    setDeletingAppointment(appointment)
    setIsDeleteOpen(true)
  }

  async function handleFormSubmit(data: AppointmentRow) {
    try {
      if (editingAppointment) {
        await updateItem(editingAppointment.code, data)
      } else {
        await scheduleAppointment(data)
      }
      setIsFormOpen(false)
    } catch {
      // error is surfaced by the hook's error state
    }
  }

  async function handleStatusChange(code: string, status: AppointmentStatus) {
    try {
      await updateStatus(code, status)
    } catch {
      // error is surfaced by the hook's error state
    }
  }

  async function handleDeleteConfirm() {
    if (!deletingAppointment) return
    setIsDeleting(true)
    try {
      await deleteItem(deletingAppointment.code)
      setIsDeleteOpen(false)
      setDeletingAppointment(null)
    } catch {
      // error is surfaced by the hook's error state
    } finally {
      setIsDeleting(false)
    }
  }

  function getAvailableStatuses(currentStatus: AppointmentStatus): AppointmentStatus[] {
    const transitions: Record<AppointmentStatus, AppointmentStatus[]> = {
      Pending: ['Confirmed', 'Cancelled'],
      Confirmed: ['Completed', 'Cancelled'],
      Completed: [],
      Cancelled: [],
    }
    return transitions[currentStatus] ?? []
  }

  // ── Column config ──────────────────────────────────────────────────────────
  const columns = useMemo<ColumnDef<AppointmentRow>[]>(
    () => [
      {
        key: 'code',
        header: 'Code',
        sortable: true,
        render: (row) => <span className="font-mono text-xs">{row.code}</span>,
      },
      { key: 'resident', header: 'Resident', sortable: true },
      {
        key: 'service',
        header: 'Service',
        sortable: true,
        filter: { type: 'select', options: [...new Set(items.map((i) => i.service))] },
        render: (row) => <span className="text-xs">{row.service}</span>,
      },
      {
        key: 'schedule',
        header: 'Schedule',
        sortable: true,
        render: (row) => <span className="text-xs">{row.schedule}</span>,
      },
      {
        key: 'status',
        header: 'Status',
        sortable: true,
        filter: { type: 'status', options: [...new Set(items.map((i) => i.status))] },
        render: (row) => <StatusBadge status={row.status} />,
      },
    ],
    [items],
  )

  // ── Render ─────────────────────────────────────────────────────────────────
  if (isLoading) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Loading appointments...</p>
  }

  if (error) {
    return <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>
  }

  return (
    <>
      {/* Toolbar */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {items.length} appointment{items.length !== 1 ? 's' : ''}
        </p>
        <button
          type="button"
          onClick={openScheduleModal}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Schedule Appointment
        </button>
      </div>

      {/* Status workflow reference */}
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-medium">Status Flow:</span>
        <span className={`rounded-full px-2 py-0.5 font-semibold ${statusStyles['Pending']}`}>Pending</span>
        <span>→</span>
        <span className={`rounded-full px-2 py-0.5 font-semibold ${statusStyles['Confirmed']}`}>Confirmed</span>
        <span>→</span>
        <span className={`rounded-full px-2 py-0.5 font-semibold ${statusStyles['Completed']}`}>Completed</span>
        <span className="ml-2">or</span>
        <span className={`rounded-full px-2 py-0.5 font-semibold ${statusStyles['Cancelled']}`}>Cancelled</span>
      </div>

      {/* Table */}
      <DataTable<AppointmentRow>
        columns={columns}
        data={items}
        rowKey={(row) => row.code}
        emptyMessage='No appointments found. Click "Schedule Appointment" to get started.'
        renderActions={(row) => {
          const availableStatuses = getAvailableStatuses(row.status)
          return (
            <div className="inline-flex items-center gap-1">
              {/* Status transition buttons */}
              {availableStatuses.map((next) => (
                <button
                  key={next}
                  type="button"
                  onClick={() => handleStatusChange(row.code, next)}
                  title={`Mark as "${next}"`}
                  className="rounded-md px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-500/10 transition-colors"
                >
                  {next === 'Confirmed' ? '✓' : next === 'Completed' ? '✔' : next === 'Cancelled' ? '✕' : ''} {next}
                </button>
              ))}
              {/* Edit */}
              <button
                type="button"
                onClick={() => openEditModal(row)}
                title="Edit"
                className="rounded-md p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              {/* Delete */}
              <button
                type="button"
                onClick={() => openDeleteDialog(row)}
                title="Delete"
                className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          )
        }}
      />

      {/* Schedule / Edit Modal */}
      <AppointmentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingAppointment}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false)
          setDeletingAppointment(null)
        }}
        onConfirm={handleDeleteConfirm}
        itemName={deletingAppointment?.code ?? ''}
        itemLabel="Appointment"
        isDeleting={isDeleting}
      />
    </>
  )
}

