import { useEffect, useMemo, useState } from 'react'
import { DataTable, StatusBadge, type ColumnDef } from '../components/DataTable'
import { useNotificationsModule } from '../composables/useNotificationsModule'
import { NotificationFormModal } from '../components/modals/NotificationFormModal'
import { DeleteConfirmationDialog } from '../components/modals/DeleteConfirmationDialog'
import type { NotificationRow } from '../types/dashboard'

/** Custom event name used by Quick Actions to open the Send Notification modal. */
export const SEND_NOTIFICATION_EVENT = 'open-send-notification-modal'

export function NotificationsModule() {
  const { items, isLoading, error, isSubmitting, sendNotification, markAsRead, dismissNotification } =
    useNotificationsModule()

  // ── Modal state ────────────────────────────────────────────────────────────
  const [isFormOpen, setIsFormOpen] = useState(false)

  // ── Delete confirmation state ──────────────────────────────────────────────
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [dismissingNotification, setDismissingNotification] = useState<NotificationRow | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // ── Listen for external "Send Notification" trigger (Quick Actions) ─────────
  useEffect(() => {
    function handleExternalSend() {
      setIsFormOpen(true)
    }
    window.addEventListener(SEND_NOTIFICATION_EVENT, handleExternalSend)
    return () => window.removeEventListener(SEND_NOTIFICATION_EVENT, handleExternalSend)
  }, [])

  // ── Handlers ───────────────────────────────────────────────────────────────
  function openSendModal() {
    setIsFormOpen(true)
  }

  async function handleFormSubmit(data: NotificationRow) {
    try {
      await sendNotification(data)
      setIsFormOpen(false)
    } catch {
      // error is surfaced by the hook's error state
    }
  }

  async function handleMarkAsRead(id: string) {
    try {
      await markAsRead(id)
    } catch {
      // error is surfaced by the hook's error state
    }
  }

  function openDismissDialog(notification: NotificationRow) {
    setDismissingNotification(notification)
    setIsDeleteOpen(true)
  }

  async function handleDismissConfirm() {
    if (!dismissingNotification) return
    setIsDeleting(true)
    try {
      await dismissNotification(dismissingNotification.id)
      setIsDeleteOpen(false)
      setDismissingNotification(null)
    } catch {
      // error is surfaced by the hook's error state
    } finally {
      setIsDeleting(false)
    }
  }

  // ── Column config (must be above early returns to respect Rules of Hooks) ─
  const columns = useMemo<ColumnDef<NotificationRow>[]>(
    () => [
      {
        key: 'channel',
        header: 'Channel',
        sortable: true,
        filter: { type: 'select', options: ['SMS', 'Email'] },
        render: (row) => (
          <span
            className={`rounded-full px-2 py-1 text-xs font-semibold ${
              row.channel === 'SMS'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300'
                : 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300'
            }`}
          >
            {row.channel}
          </span>
        ),
      },
      { key: 'recipient', header: 'Recipient', sortable: true },
      {
        key: 'message',
        header: 'Message',
        sortable: false,
        render: (row) => (
          <span className="max-w-xs truncate" title={row.message}>
            {row.message}
          </span>
        ),
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
    return <p className="text-sm text-slate-500 dark:text-slate-400">Loading notifications...</p>
  }

  if (error) {
    return <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>
  }

  const unreadCount = items.filter((n) => !n.isRead).length

  return (
    <>
      {/* Toolbar */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {items.length} notification{items.length !== 1 ? 's' : ''}
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700 dark:bg-rose-500/20 dark:text-rose-300">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={openSendModal}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Send Notification
        </button>
      </div>

      {/* Table */}
      <DataTable<NotificationRow>
        columns={columns}
        data={items}
        rowKey={(row) => row.id}
        emptyMessage='No notifications found. Click "Send Notification" to get started.'
        renderActions={(row) => (
          <div className="inline-flex items-center gap-1">
            {/* Mark as read / Unread toggle */}
            {!row.isRead ? (
              <button
                type="button"
                onClick={() => handleMarkAsRead(row.id)}
                disabled={isSubmitting}
                title="Mark as read"
                className="rounded-md px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 disabled:opacity-60 dark:text-emerald-400 dark:hover:bg-emerald-500/10 transition-colors"
              >
                ✓ Read
              </button>
            ) : (
              <span className="rounded-md px-2 py-1 text-xs font-medium text-slate-400 dark:text-slate-500">
                Read
              </span>
            )}

            {/* Dismiss button */}
            <button
              type="button"
              onClick={() => openDismissDialog(row)}
              disabled={isSubmitting}
              title="Dismiss notification"
              className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-60 dark:text-slate-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 transition-colors"
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

      {/* Send Notification Modal */}
      <NotificationFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Dismiss Confirmation */}
      <DeleteConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false)
          setDismissingNotification(null)
        }}
        onConfirm={handleDismissConfirm}
        itemName={dismissingNotification?.recipient ?? ''}
        itemLabel="Notification"
        isDeleting={isDeleting}
      />
    </>
  )
}

