import { useEffect, useMemo, useState } from 'react'
import { DataTable, StatusBadge, type ColumnDef } from '../components/DataTable'
import { useUsersModule } from '../composables/useUsersModule'
import { UserFormModal } from '../components/modals/UserFormModal'
import { DeleteConfirmationDialog } from '../components/modals/DeleteConfirmationDialog'
import type { UserRow } from '../types/dashboard'

/** Custom event name used by Quick Actions to open the Add User modal. */
export const ADD_USER_EVENT = 'open-add-user-modal'

const ROLE_DISPLAY: Record<string, string> = {
  admin: 'Admin',
  staff: 'Staff',
  approver: 'Approver',
  resident: 'Resident',
}

export function UsersModule() {
  const {
    items,
    isLoading,
    error,
    isSubmitting,
    createItem,
    updateItem,
    deleteItem,
    activateUser,
    deactivateUser,
  } = useUsersModule()

  // ── Modal state ────────────────────────────────────────────────────────────
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserRow | null>(null)

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingUser, setDeletingUser] = useState<UserRow | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // ── Listen for external "Add User" trigger (Quick Actions) ─────────
  useEffect(() => {
    function handleExternalAdd() {
      setEditingUser(null)
      setIsFormOpen(true)
    }
    window.addEventListener(ADD_USER_EVENT, handleExternalAdd)
    return () => window.removeEventListener(ADD_USER_EVENT, handleExternalAdd)
  }, [])

  // ── Handlers ───────────────────────────────────────────────────────────────
  function openAddModal() {
    setEditingUser(null)
    setIsFormOpen(true)
  }

  function openEditModal(user: UserRow) {
    setEditingUser(user)
    setIsFormOpen(true)
  }

  function openDeleteDialog(user: UserRow) {
    setDeletingUser(user)
    setIsDeleteOpen(true)
  }

  async function handleFormSubmit(data: UserRow) {
    try {
      if (editingUser) {
        await updateItem(editingUser.id, data)
      } else {
        await createItem(data)
      }
      setIsFormOpen(false)
    } catch {
      // error is surfaced by the hook's error state
    }
  }

  async function handleDeleteConfirm() {
    if (!deletingUser) return
    setIsDeleting(true)
    try {
      await deleteItem(deletingUser.id)
      setIsDeleteOpen(false)
      setDeletingUser(null)
    } catch {
      // error is surfaced by the hook's error state
    } finally {
      setIsDeleting(false)
    }
  }

  async function handleToggleStatus(user: UserRow) {
    try {
      if (user.status === 'Active') {
        await deactivateUser(user.id)
      } else {
        await activateUser(user.id)
      }
    } catch {
      // error is surfaced by the hook's error state
    }
  }

  // ── Column config ──────────────────────────────────────────────────────────
  const columns = useMemo<ColumnDef<UserRow>[]>(
    () => [
      { key: 'name', header: 'Name', sortable: true },
      {
        key: 'email',
        header: 'Email',
        sortable: true,
        render: (row) => <span className="text-xs">{row.email}</span>,
      },
      {
        key: 'role',
        header: 'Role',
        sortable: true,
        filter: { type: 'select', options: ['admin', 'staff', 'approver', 'resident'] },
        render: (row) => <>{ROLE_DISPLAY[row.role] || row.role}</>,
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
    return <p className="text-sm text-slate-500 dark:text-slate-400">Loading users...</p>
  }

  if (error) {
    return <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>
  }

  return (
    <>
      {/* Toolbar */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {items.length} user{items.length !== 1 ? 's' : ''}
        </p>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add User
        </button>
      </div>

      {/* Table */}
      <DataTable<UserRow>
        columns={columns}
        data={items}
        rowKey={(row) => row.id}
        emptyMessage='No users found. Click "Add User" to get started.'
        renderActions={(row) => (
          <div className="inline-flex items-center gap-1">
            {/* Activate / Deactivate */}
            <button
              type="button"
              onClick={() => handleToggleStatus(row)}
              title={row.status === 'Active' ? 'Deactivate' : 'Activate'}
              className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                row.status === 'Active'
                  ? 'text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-500/10'
                  : 'text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10'
              }`}
            >
              {row.status === 'Active' ? '⊘ Deactivate' : '✓ Activate'}
            </button>
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
        )}
      />

      {/* Add / Edit Modal */}
      <UserFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingUser}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false)
          setDeletingUser(null)
        }}
        onConfirm={handleDeleteConfirm}
        itemName={deletingUser?.name ?? ''}
        itemLabel="User"
        isDeleting={isDeleting}
      />
    </>
  )
}

