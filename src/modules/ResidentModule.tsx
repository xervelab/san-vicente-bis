import { residentRows, statusStyles } from '../data/dashboardData'

export function ResidentModule() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
          <tr>
            <th className="px-3 py-2">Name</th>
            <th className="px-3 py-2">Age</th>
            <th className="px-3 py-2">Purok</th>
            <th className="px-3 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {residentRows.map((row) => (
            <tr key={row.name} className="border-b border-slate-100 dark:border-slate-800">
              <td className="px-3 py-2">{row.name}</td>
              <td className="px-3 py-2">{row.age}</td>
              <td className="px-3 py-2">{row.purok}</td>
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
