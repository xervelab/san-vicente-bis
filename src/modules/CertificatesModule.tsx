import { useEffect, useState } from 'react'
import { statusStyles } from '../data/dashboardData'
import { useCertificatesModule } from '../composables/useCertificatesModule'
import { useResidentModule } from '../composables/useResidentModule'
import { CertificateFormModal } from '../components/modals/CertificateFormModal'
import { DeleteConfirmationDialog } from '../components/modals/DeleteConfirmationDialog'
import type { CertificateRow } from '../types/dashboard'

/** Custom event name used by Quick Actions to open the Issue Certificate modal. */
export const ISSUE_CERTIFICATE_EVENT = 'open-issue-certificate-modal'

/** Certificate status workflow: Processing → For Pickup → Released. Can also be Rejected. */
const STATUS_ACTIONS: Record<string, { label: string; next: string; color: string }[]> = {
  Processing: [
    {
      label: 'Approve',
      next: 'For Pickup',
      color:
        'bg-sky-100 text-sky-700 hover:bg-sky-200 dark:bg-sky-500/20 dark:text-sky-300 dark:hover:bg-sky-500/30',
    },
    {
      label: 'Reject',
      next: 'Rejected',
      color:
        'bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:hover:bg-rose-500/30',
    },
  ],
  'For Pickup': [
    {
      label: 'Release',
      next: 'Released',
      color:
        'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:hover:bg-emerald-500/30',
    },
    {
      label: 'Reject',
      next: 'Rejected',
      color:
        'bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:hover:bg-rose-500/30',
    },
  ],
}

export function CertificatesModule() {
  const { items, isLoading, error, createItem, updateItem, deleteItem } = useCertificatesModule()
  const { items: residents } = useResidentModule()

  // ── Modal state ────────────────────────────────────────────────────────────
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCert, setEditingCert] = useState<CertificateRow | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingCert, setDeletingCert] = useState<CertificateRow | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Resident names for the picker
  const residentNames = residents.map((r) => r.name)

  // ── Listen for external "Issue Certificate" trigger (Quick Actions) ────
  useEffect(() => {
    function handleExternalAdd() {
      setEditingCert(null)
      setIsFormOpen(true)
    }
    window.addEventListener(ISSUE_CERTIFICATE_EVENT, handleExternalAdd)
    return () => window.removeEventListener(ISSUE_CERTIFICATE_EVENT, handleExternalAdd)
  }, [])

  // ── Helpers ────────────────────────────────────────────────────────────────
  function certId(row: CertificateRow) {
    return `${row.type}-${row.resident}`
  }

  // ── Handlers ───────────────────────────────────────────────────────────────
  function openAddModal() {
    setEditingCert(null)
    setIsFormOpen(true)
  }

  function openEditModal(cert: CertificateRow) {
    setEditingCert(cert)
    setIsFormOpen(true)
  }

  function openDeleteDialog(cert: CertificateRow) {
    setDeletingCert(cert)
    setIsDeleteOpen(true)
  }

  async function handleFormSubmit(data: CertificateRow) {
    setIsSubmitting(true)
    try {
      if (editingCert) {
        await updateItem(certId(editingCert), data)
      } else {
        await createItem(data)
      }
      setIsFormOpen(false)
    } catch {
      // error is surfaced by the hook
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeleteConfirm() {
    if (!deletingCert) return
    setIsDeleting(true)
    try {
      await deleteItem(certId(deletingCert))
      setIsDeleteOpen(false)
      setDeletingCert(null)
    } catch {
      // error is surfaced by the hook
    } finally {
      setIsDeleting(false)
    }
  }

  async function handleStatusChange(cert: CertificateRow, newStatus: string) {
    const id = certId(cert)
    setUpdatingId(id)
    try {
      await updateItem(id, { ...cert, status: newStatus })
    } catch {
      // error is surfaced by the hook
    } finally {
      setUpdatingId(null)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  if (isLoading) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Loading certificates...</p>
  }

  if (error) {
    return <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>
  }

  return (
    <>
      {/* Toolbar */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {items.length} certificate{items.length !== 1 ? 's' : ''}
        </p>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Issue Certificate
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
            <tr>
              <th className="px-3 py-2">Certificate Type</th>
              <th className="px-3 py-2">Resident</th>
              <th className="px-3 py-2">Date Requested</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => {
              const id = certId(row)
              const actions = STATUS_ACTIONS[row.status] ?? []
              const isRowUpdating = updatingId === id

              return (
                <tr
                  key={id}
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-3 py-2">{row.type}</td>
                  <td className="px-3 py-2">{row.resident}</td>
                  <td className="px-3 py-2">{row.date}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyles[row.status] ?? ''}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="inline-flex flex-wrap items-center gap-1">
                      {/* Status action buttons */}
                      {actions.map((action) => (
                        <button
                          key={action.label}
                          type="button"
                          onClick={() => handleStatusChange(row, action.next)}
                          disabled={isRowUpdating}
                          title={`${action.label} → ${action.next}`}
                          className={`rounded-md px-2 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${action.color}`}
                        >
                          {isRowUpdating ? '…' : action.label}
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
                  </td>
                </tr>
              )
            })}

            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                  No certificates found. Click "Issue Certificate" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      <CertificateFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingCert}
        isSubmitting={isSubmitting}
        residentNames={residentNames}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false)
          setDeletingCert(null)
        }}
        onConfirm={handleDeleteConfirm}
        itemName={deletingCert ? `${deletingCert.type} — ${deletingCert.resident}` : ''}
        itemLabel="Certificate"
        isDeleting={isDeleting}
      />
    </>
  )
}
