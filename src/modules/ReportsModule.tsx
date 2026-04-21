import { reportRows } from '../data/dashboardData'

export function ReportsModule() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {reportRows.map((row) => (
        <article
          key={row.label}
          className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800"
        >
          <h4 className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{row.label}</h4>
          <p className="text-sm text-slate-600 dark:text-slate-300">{row.value}</p>
        </article>
      ))}
    </div>
  )
}
