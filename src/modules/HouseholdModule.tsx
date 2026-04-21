import { useHouseholdModule } from '../composables/useHouseholdModule'

export function HouseholdModule() {
  const { items, isLoading, error } = useHouseholdModule()

  if (isLoading) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Loading households...</p>
  }

  if (error) {
    return <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
          <tr>
            <th className="px-3 py-2">Household Head</th>
            <th className="px-3 py-2">Members</th>
            <th className="px-3 py-2">Address</th>
            <th className="px-3 py-2">Purok</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row) => (
            <tr key={row.head} className="border-b border-slate-100 dark:border-slate-800">
              <td className="px-3 py-2">{row.head}</td>
              <td className="px-3 py-2">{row.members}</td>
              <td className="px-3 py-2">{row.address}</td>
              <td className="px-3 py-2">{row.purok}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
