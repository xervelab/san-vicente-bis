import { statusStyles } from '../data/dashboardData'
import { useBlotterModule } from '../composables/useBlotterModule'

export function BlotterModule() {
  const { items, isLoading, error } = useBlotterModule()

  if (isLoading) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Loading blotter records...</p>
  }

  if (error) {
    return <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
          <tr>
            <th className="px-3 py-2">Record No.</th>
            <th className="px-3 py-2">Complainant</th>
            <th className="px-3 py-2">Incident</th>
            <th className="px-3 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row) => (
            <tr key={row.code} className="border-b border-slate-100 dark:border-slate-800">
              <td className="px-3 py-2">{row.code}</td>
              <td className="px-3 py-2">{row.complainant}</td>
              <td className="px-3 py-2">{row.incident}</td>
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
