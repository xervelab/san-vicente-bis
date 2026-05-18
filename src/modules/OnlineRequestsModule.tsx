import { useMemo } from 'react'
import { statusStyles } from '../data/dashboardData'
import { DataTable, StatusBadge, type ColumnDef } from '../components/DataTable'
import { useOnlineRequestsModule } from '../composables/useOnlineRequestsModule'
import type { OnlineRequestRow } from '../types/dashboard'

export function OnlineRequestsModule() {
  const { items, isLoading, error, isSubmitting, approveRequest, rejectRequest, completeRequest } =
    useOnlineRequestsModule()

  async function handleApprove(id: string) {
    try {
      await approveRequest(id)
    } catch {
      // error is surfaced by the hook's error state
    }
  }

  async function handleReject(id: string) {
    try {
      await rejectRequest(id)
    } catch {
      // error is surfaced by the hook's error state
    }
  }

  async function handleComplete(id: string) {
    try {
      await completeRequest(id)
    } catch {
      // error is surfaced by the hook's error state
    }
  }

  // ── Column config ──────────────────────────────────────────────────────────
  const columns = useMemo<ColumnDef<OnlineRequestRow>[]>(
    () => [
      {
        key: 'id',
        header: 'Request ID',
        sortable: true,
        render: (row) => <span className="font-mono text-xs">{row.id}</span>,
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
        key: 'submittedAt',
        header: 'Submitted',
        sortable: true,
        render: (row) => <span className="text-xs">{row.submittedAt}</span>,
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

  if (isLoading) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Loading online requests...</p>
  }

  if (error) {
    return <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>
  }

  return (
    <>
      {/* Status workflow reference */}
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-medium">Process Flow:</span>
        <span className={`rounded-full px-2 py-0.5 font-semibold ${statusStyles['Processing']}`}>Processing</span>
        <span>→</span>
        <span className={`rounded-full px-2 py-0.5 font-semibold ${statusStyles['Approved']}`}>Approved</span>
        <span>→</span>
        <span className={`rounded-full px-2 py-0.5 font-semibold ${statusStyles['Released']}`}>Released</span>
        <span className="ml-2">or reject:</span>
        <span className={`rounded-full px-2 py-0.5 font-semibold ${statusStyles['Rejected']}`}>Rejected</span>
      </div>

      <DataTable<OnlineRequestRow>
        columns={columns}
        data={items}
        rowKey={(row) => row.id}
        emptyMessage="No online requests found."
        renderActions={(row) => {
          const canApprove = row.status === 'Processing'
          const canReject = row.status === 'Processing'
          const canComplete = row.status === 'Approved'

          return (
            <div className="inline-flex items-center gap-1">
              {/* Approve button */}
              {canApprove && (
                <button
                  type="button"
                  onClick={() => handleApprove(row.id)}
                  disabled={isSubmitting}
                  title="Approve this request"
                  className="rounded-md px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 disabled:opacity-60 dark:text-emerald-400 dark:hover:bg-emerald-500/10 transition-colors"
                >
                  ✓ Approve
                </button>
              )}

              {/* Reject button */}
              {canReject && (
                <button
                  type="button"
                  onClick={() => handleReject(row.id)}
                  disabled={isSubmitting}
                  title="Reject this request"
                  className="rounded-md px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-60 dark:text-rose-400 dark:hover:bg-rose-500/10 transition-colors"
                >
                  ✕ Reject
                </button>
              )}

              {/* Complete/Release button */}
              {canComplete && (
                <button
                  type="button"
                  onClick={() => handleComplete(row.id)}
                  disabled={isSubmitting}
                  title="Mark as released/complete"
                  className="rounded-md px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 disabled:opacity-60 dark:text-indigo-400 dark:hover:bg-indigo-500/10 transition-colors"
                >
                  ✔ Complete
                </button>
              )}
            </div>
          )
        }}
      />
    </>
  )
}
