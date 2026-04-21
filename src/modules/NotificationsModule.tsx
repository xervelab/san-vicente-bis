import { statusStyles } from '../data/dashboardData'
import { useNotificationsModule } from '../composables/useNotificationsModule'

export function NotificationsModule() {
  const { items, isLoading, error } = useNotificationsModule()

  if (isLoading) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Loading notifications...</p>
  }

  if (error) {
    return <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
          <tr>
            <th className="px-3 py-2">Channel</th>
            <th className="px-3 py-2">Recipient</th>
            <th className="px-3 py-2">Message</th>
            <th className="px-3 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row) => (
            <tr key={`${row.channel}-${row.recipient}`} className="border-b border-slate-100 dark:border-slate-800">
              <td className="px-3 py-2">{row.channel}</td>
              <td className="px-3 py-2">{row.recipient}</td>
              <td className="px-3 py-2">{row.message}</td>
              <td className="px-3 py-2">
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyles[row.status]}`}>
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
