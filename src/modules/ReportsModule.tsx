import { useReportsModule } from '../composables/useReportsModule'

export function ReportsModule() {
  const { items, summary, isLoading, error } = useReportsModule()

  if (isLoading) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Loading reports...</p>
  }

  if (error) {
    return <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>
  }

  return (
    <>
      {summary && (
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
          {summary.totalCards} report cards generated • {new Date(summary.generatedAt).toLocaleString('en-PH')}
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-3">
        {items.map((row) => (
          <article
            key={row.label}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800"
          >
            <h4 className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{row.label}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">{row.value}</p>
          </article>
        ))}
      </div>
    </>
  )
}
