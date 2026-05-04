import { useEffect, useState } from 'react'
import { statusStyles } from '../data/dashboardData'
import { useBlotterModule } from '../composables/useBlotterModule'
import { BlotterFormModal } from '../components/modals/BlotterFormModal'
import { DeleteConfirmationDialog } from '../components/modals/DeleteConfirmationDialog'
import type { BlotterRow, BlotterStatus } from '../types/dashboard'

/** Custom event name used by Quick Actions to open the File Blotter modal. */
export const FILE_BLOTTER_EVENT = 'open-file-blotter-modal'

export function BlotterModule() {
  const {
    items,
    isLoading,
    error,
    isSubmitting,
    fileBlotter,
    advanceStatus,
    getNextStatuses,
    updateItem,
    deleteItem,
  } = useBlotterModule()

  // ── Modal state ────────────────────────────────────────────────────────────
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingBlotter, setEditingBlotter] = useState<BlotterRow | null>(null)

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingBlotter, setDeletingBlotter] = useState<BlotterRow | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // ── Listen for external "File Blotter" trigger (Quick Actions) ─────────
  useEffect(() => {
    function handleExternalFile() {
      setEditingBlotter(null)
      setIsFormOpen(true)
    }
    window.addEventListener(FILE_BLOTTER_EVENT, handleExternalFile)
    return () => window.removeEventListener(FILE_BLOTTER_EVENT, handleExternalFile)
  }, [])

  // ── Handlers ───────────────────────────────────────────────────────────────
  function openFileModal() {
    setEditingBlotter(null)
    setIsFormOpen(true)
  }

  function openEditModal(blotter: BlotterRow) {
    setEditingBlotter(blotter)
    setIsFormOpen(true)
  }

  function openDeleteDialog(blotter: BlotterRow) {
    setDeletingBlotter(blotter)
    setIsDeleteOpen(true)
  }

  async function handleFormSubmit(data: BlotterRow) {
    try {
      if (editingBlotter) {
        await updateItem(editingBlotter.code, data)
      } else {
        await fileBlotter(data)
      }
      setIsFormOpen(false)
    } catch {
      // error is surfaced by the hook's error state
    }
  }

  async function handleStatusChange(code: string, nextStatus: BlotterStatus) {
    try {
      await advanceStatus(code, nextStatus)
    } catch {
      // error is surfaced by the hook's error state
    }
  }

  async function handleDeleteConfirm() {
    if (!deletingBlotter) return
    setIsDeleting(true)
    try {
      await deleteItem(deletingBlotter.code)
      setIsDeleteOpen(false)
      setDeletingBlotter(null)
    } catch {
      // error is surfaced by the hook's error state
    } finally {
      setIsDeleting(false)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  if (isLoading) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Loading blotter records...</p>
  }

  if (error) {
    return <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>
  }

  return (
    <>
      {/* Toolbar */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {items.length} record{items.length !== 1 ? 's' : ''}
        </p>
        <button
          type="button"
          onClick={openFileModal}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          File Blotter
        </button>
      </div>

      {/* Status Workflow Legend */}
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-medium">Workflow:</span>
        <span className={`rounded-full px-2 py-0.5 font-semibold ${statusStyles['Filed']}`}>Filed</span>
        <span>→</span>
        <span className={`rounded-full px-2 py-0.5 font-semibold ${statusStyles['Under Investigation']}`}>Under Investigation</span>
        <span>→</span>
        <span className={`rounded-full px-2 py-0.5 font-semibold ${statusStyles['Resolved']}`}>Resolved</span>
        <span>/</span>
        <span className={`rounded-full px-2 py-0.5 font-semibold ${statusStyles['Dismissed']}`}>Dismissed</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
            <tr>
              <th className="px-3 py-2">Record No.</th>
              <th className="px-3 py-2">Complainant</th>
              <th className="px-3 py-2">Respondent</th>
              <th className="px-3 py-2">Incident</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => {
              const nextStatuses = getNextStatuses(row.status)
              return (
                <tr
                  key={row.code}
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-3 py-2 font-mono text-xs">{row.code}</td>
                  <td className="px-3 py-2">{row.complainant}</td>
                  <td className="px-3 py-2">{row.respondent}</td>
                  <td className="px-3 py-2">
                    <span title={row.incidentDetails}>{row.incident}</span>
                  </td>
                  <td className="px-3 py-2 text-xs">{row.incidentDate}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyles[row.status] ?? ''}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="inline-flex items-center gap-1">
                      {/* Status transition buttons */}
                      {nextStatuses.map((next) => (
                        <button
                          key={next}
                          type="button"
                          onClick={() => handleStatusChange(row.code, next)}
                          title={`Move to "${next}"`}
                          className="rounded-md px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-500/10 transition-colors"
                        >
                          → {next === 'Under Investigation' ? 'Investigate' : next}
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
                <td colSpan={7} className="px-3 py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                  No blotter records found. Click "File Blotter" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* File / Edit Modal */}
      <BlotterFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingBlotter}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false)
          setDeletingBlotter(null)
        }}
        onConfirm={handleDeleteConfirm}
        itemName={deletingBlotter?.code ?? ''}
        itemLabel="Blotter Record"
        isDeleting={isDeleting}
      />
    </>
  )
}

