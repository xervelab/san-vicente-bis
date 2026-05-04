import { useEffect, useState } from 'react'
import { statusStyles } from '../data/dashboardData'
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
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr
                key={row.id}
                className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="px-3 py-2">{row.name}</td>
                <td className="px-3 py-2 text-xs">{row.email}</td>
                <td className="px-3 py-2">{ROLE_DISPLAY[row.role] || row.role}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyles[row.status] ?? ''}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
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
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                  No users found. Click "Add User" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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

