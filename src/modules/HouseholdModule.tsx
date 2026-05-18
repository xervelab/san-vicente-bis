import { useEffect, useState, useMemo } from 'react'
import { useHouseholdModule } from '../composables/useHouseholdModule'
import { HouseholdFormModal } from '../components/modals/HouseholdFormModal'
import { DeleteConfirmationDialog } from '../components/modals/DeleteConfirmationDialog'
import { DataTable, type ColumnDef } from '../components/DataTable'
import type { HouseholdRow } from '../types/dashboard'

/** Custom event name used by Quick Actions to open the Add Household modal. */
export const ADD_HOUSEHOLD_EVENT = 'open-add-household-modal'

export function HouseholdModule() {
  const { items, isLoading, error, createItem, updateItem, deleteItem } = useHouseholdModule()

  // ── Modal state ────────────────────────────────────────────────────────────
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingHousehold, setEditingHousehold] = useState<HouseholdRow | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingHousehold, setDeletingHousehold] = useState<HouseholdRow | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // ── Listen for external "Add Household" trigger (Quick Actions) ────────
  useEffect(() => {
    function handleExternalAdd() {
      setEditingHousehold(null)
      setIsFormOpen(true)
    }
    window.addEventListener(ADD_HOUSEHOLD_EVENT, handleExternalAdd)
    return () => window.removeEventListener(ADD_HOUSEHOLD_EVENT, handleExternalAdd)
  }, [])

  // ── Column config ──────────────────────────────────────────────────────────
  const purokOptions = useMemo(
    () => [...new Set(items.map((r) => r.purok))].sort(),
    [items],
  )

  const columns: ColumnDef<HouseholdRow>[] = useMemo(
    () => [
      { key: 'head', header: 'Household Head', sortable: true },
      { key: 'members', header: 'Members', sortable: true },
      { key: 'address', header: 'Address', sortable: true },
      {
        key: 'purok',
        header: 'Purok',
        sortable: true,
        filter: { type: 'select', options: purokOptions },
      },
    ],
    [purokOptions],
  )

  // ── Handlers ───────────────────────────────────────────────────────────────
  function openAddModal() {
    setEditingHousehold(null)
    setIsFormOpen(true)
  }

  function openEditModal(household: HouseholdRow) {
    setEditingHousehold(household)
    setIsFormOpen(true)
  }

  function openDeleteDialog(household: HouseholdRow) {
    setDeletingHousehold(household)
    setIsDeleteOpen(true)
  }

  async function handleFormSubmit(data: HouseholdRow) {
    setIsSubmitting(true)
    try {
      if (editingHousehold) {
        await updateItem(editingHousehold.head, data)
      } else {
        await createItem(data)
      }
      setIsFormOpen(false)
    } catch {
      // error is surfaced by the hook's error state
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeleteConfirm() {
    if (!deletingHousehold) return
    setIsDeleting(true)
    try {
      await deleteItem(deletingHousehold.head)
      setIsDeleteOpen(false)
      setDeletingHousehold(null)
    } catch {
      // error is surfaced by the hook's error state
    } finally {
      setIsDeleting(false)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  if (isLoading) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Loading households...</p>
  }

  if (error) {
    return <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>
  }

  return (
    <>
      {/* Toolbar */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {items.length} household{items.length !== 1 ? 's' : ''}
        </p>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Household
        </button>
      </div>

      {/* DataTable */}
      <DataTable<HouseholdRow>
        columns={columns}
        data={items}
        rowKey={(row) => row.head}
        searchPlaceholder="Search households…"
        emptyMessage='No households found. Click "Add Household" to get started.'
        renderActions={(row) => (
          <div className="inline-flex gap-1">
            <button
              type="button"
              onClick={() => openEditModal(row)}
              title="Edit"
              className="rounded-md p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => openDeleteDialog(row)}
              title="Delete"
              className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      />

      {/* Add / Edit Modal */}
      <HouseholdFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingHousehold}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false)
          setDeletingHousehold(null)
        }}
        onConfirm={handleDeleteConfirm}
        itemName={deletingHousehold?.head ?? ''}
        itemLabel="Household"
        isDeleting={isDeleting}
      />
    </>
  )
}
