import { statusStyles } from '../data/dashboardData'
import { useOnlineRequestsModule } from '../composables/useOnlineRequestsModule'

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

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
            <tr>
              <th className="px-3 py-2">Request ID</th>
              <th className="px-3 py-2">Resident</th>
              <th className="px-3 py-2">Service</th>
              <th className="px-3 py-2">Submitted</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => {
              // Show action buttons based on current status
              const canApprove = row.status === 'Processing'
              const canReject = row.status === 'Processing'
              const canComplete = row.status === 'Approved'

              return (
                <tr
                  key={row.id}
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-3 py-2 font-mono text-xs">{row.id}</td>
                  <td className="px-3 py-2">{row.resident}</td>
                  <td className="px-3 py-2 text-xs">{row.service}</td>
                  <td className="px-3 py-2 text-xs">{row.submittedAt}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyles[row.status] ?? ''}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
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
                  </td>
                </tr>
              )
            })}

            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                  No online requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
