import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { useDebounce } from '../composables/shared/useDebounce'
import { statusStyles } from '../data/dashboardData'

// ── Column definition ────────────────────────────────────────────────────────

export type SortDirection = 'asc' | 'desc' | null

export type FilterType = 'status' | 'date' | 'select'

export type ColumnFilter = {
  /** Type of filter to render. */
  type: FilterType
  /**
   * For 'status'/'select' – the list of allowed values shown in the dropdown.
   * For 'date' – ignored (a date-range picker is rendered).
   */
  options?: string[]
}

export type ColumnDef<T> = {
  /** Unique key matching a property of T (or a custom string for computed columns). */
  key: string
  /** Header label. */
  header: string
  /** Whether this column is sortable. Defaults to false. */
  sortable?: boolean
  /** Column filter config. Omit for no filter. */
  filter?: ColumnFilter
  /**
   * Custom cell renderer.
   * Receives the row and should return a ReactNode.
   * When omitted, the raw value is rendered as text.
   */
  render?: (row: T) => ReactNode
  /** If true, this column's raw text is included in global search. Defaults to true. */
  searchable?: boolean
  /** Text alignment. Defaults to 'left'. */
  align?: 'left' | 'center' | 'right'
}

// ── Pagination defaults ──────────────────────────────────────────────────────

export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50] as const
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number]
const DEFAULT_PAGE_SIZE: PageSize = 10

// ── Component props ──────────────────────────────────────────────────────────

type DataTableProps<T> = {
  /** Column definitions controlling headers, rendering, sorting, and filtering. */
  columns: ColumnDef<T>[]
  /** The full data set (unfiltered). */
  data: T[]
  /** Unique key extractor for each row. */
  rowKey: (row: T) => string
  /** Optional extra column rendered at the end of every row (e.g. action buttons). */
  renderActions?: (row: T) => ReactNode
  /** Message shown when the filtered result set is empty. */
  emptyMessage?: string
  /** Whether to show the global search bar. Defaults to true. */
  searchable?: boolean
  /** Placeholder text for the search input. */
  searchPlaceholder?: string
  /** Whether to enable pagination. Defaults to true. */
  paginated?: boolean
  /** Default page size. Defaults to 10. */
  defaultPageSize?: PageSize
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getRawValue<T>(row: T, key: string): unknown {
  return (row as Record<string, unknown>)[key]
}

function toSortableValue(raw: unknown): string | number {
  if (typeof raw === 'number') return raw
  return String(raw ?? '').toLowerCase()
}

// ── Sort icon ────────────────────────────────────────────────────────────────

function SortIcon({ direction }: { direction: SortDirection }) {
  if (!direction) {
    return (
      <svg className="ml-1 inline h-3 w-3 text-slate-300 dark:text-slate-600" viewBox="0 0 10 14" fill="currentColor">
        <path d="M5 0l4 5H1z" />
        <path d="M5 14l-4-5h8z" />
      </svg>
    )
  }
  return (
    <svg className="ml-1 inline h-3 w-3 text-indigo-500" viewBox="0 0 10 14" fill="currentColor">
      {direction === 'asc' ? <path d="M5 0l4 5H1z" /> : <path d="M5 14l-4-5h8z" />}
    </svg>
  )
}

// ── DataTable ────────────────────────────────────────────────────────────────

export function DataTable<T>({
  columns,
  data,
  rowKey,
  renderActions,
  emptyMessage = 'No records found.',
  searchable = true,
  searchPlaceholder = 'Search…',
  paginated = true,
  defaultPageSize = DEFAULT_PAGE_SIZE,
}: DataTableProps<T>) {
  // ── Global search ────────────────────────────────────────────────────────
  const [searchText, setSearchText] = useState('')
  const debouncedSearch = useDebounce(searchText, 300)

  // ── Column filters ───────────────────────────────────────────────────────
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({})
  const [dateFilters, setDateFilters] = useState<Record<string, { from: string; to: string }>>({})

  // ── Sorting ──────────────────────────────────────────────────────────────
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<SortDirection>(null)

  // ── Pagination ───────────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState<PageSize>(defaultPageSize)

  function toggleSort(key: string) {
    if (sortKey !== key) {
      setSortKey(key)
      setSortDir('asc')
    } else if (sortDir === 'asc') {
      setSortDir('desc')
    } else {
      setSortKey(null)
      setSortDir(null)
    }
  }

  // ── Derived: filter → search → sort ───────────────────────────────────
  const processedData = useMemo(() => {
    let result = [...data]

    // 1. Column filters
    for (const col of columns) {
      if (col.filter) {
        if (col.filter.type === 'date') {
          const range = dateFilters[col.key]
          if (range?.from || range?.to) {
            result = result.filter((row) => {
              const val = String(getRawValue(row, col.key) ?? '')
              if (range.from && val < range.from) return false
              if (range.to && val > range.to) return false
              return true
            })
          }
        } else {
          const selected = columnFilters[col.key]
          if (selected) {
            result = result.filter((row) => String(getRawValue(row, col.key)) === selected)
          }
        }
      }
    }

    // 2. Global text search
    if (debouncedSearch.trim()) {
      const terms = debouncedSearch.toLowerCase().trim()
      const searchableKeys = columns.filter((c) => c.searchable !== false).map((c) => c.key)
      result = result.filter((row) =>
        searchableKeys.some((key) => {
          const raw = getRawValue(row, key)
          return String(raw ?? '')
            .toLowerCase()
            .includes(terms)
        }),
      )
    }

    // 3. Sort
    if (sortKey && sortDir) {
      result.sort((a, b) => {
        const aVal = toSortableValue(getRawValue(a, sortKey))
        const bVal = toSortableValue(getRawValue(b, sortKey))
        if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
        if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
        return 0
      })
    }

    return result
  }, [data, columns, debouncedSearch, columnFilters, dateFilters, sortKey, sortDir])

  // Reset to page 1 whenever filters, search, or sort change
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, columnFilters, dateFilters, sortKey, sortDir])

  // ── Pagination slice ─────────────────────────────────────────────────────
  const totalFiltered = processedData.length
  const totalPages = paginated ? Math.max(1, Math.ceil(totalFiltered / pageSize)) : 1
  // Clamp currentPage if data shrinks
  const safePage = Math.min(currentPage, totalPages)

  const paginatedData = useMemo(() => {
    if (!paginated) return processedData
    const start = (safePage - 1) * pageSize
    return processedData.slice(start, start + pageSize)
  }, [processedData, paginated, safePage, pageSize])

  const showingFrom = totalFiltered === 0 ? 0 : (safePage - 1) * pageSize + 1
  const showingTo = Math.min(safePage * pageSize, totalFiltered)

  const handlePageSizeChange = useCallback(
    (newSize: PageSize) => {
      setPageSize(newSize)
      setCurrentPage(1)
    },
    [],
  )

  /** Generate visible page numbers with ellipsis placeholders (null). */
  function getPageNumbers(): (number | null)[] {
    const pages: (number | null)[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (safePage > 3) pages.push(null)
      const start = Math.max(2, safePage - 1)
      const end = Math.min(totalPages - 1, safePage + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (safePage < totalPages - 2) pages.push(null)
      pages.push(totalPages)
    }
    return pages
  }

  const totalColumns = columns.length + (renderActions ? 1 : 0)

  // Check if any filter is active
  const hasActiveFilters =
    Object.values(columnFilters).some(Boolean) ||
    Object.values(dateFilters).some((d) => d.from || d.to)

  function clearAllFilters() {
    setColumnFilters({})
    setDateFilters({})
    setSearchText('')
  }

  // ── Filter bar visibility ────────────────────────────────────────────────
  const filterColumns = columns.filter((c) => c.filter)
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="space-y-3">
      {/* ── Search bar + filter toggle ──────────────────────────────────────── */}
      {(searchable || filterColumns.length > 0) && (
        <div className="flex flex-wrap items-center gap-2">
          {searchable && (
            <div className="relative flex-1 min-w-[200px]">
              <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/30"
              />
              {searchText && (
                <button
                  type="button"
                  onClick={() => setSearchText('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {filterColumns.length > 0 && (
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                showFilters || hasActiveFilters
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-300'
                  : 'border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
              {hasActiveFilters && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                  {Object.values(columnFilters).filter(Boolean).length +
                    Object.values(dateFilters).filter((d) => d.from || d.to).length}
                </span>
              )}
            </button>
          )}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* ── Column filters row ──────────────────────────────────────────────── */}
      {showFilters && filterColumns.length > 0 && (
        <div className="flex flex-wrap items-end gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
          {filterColumns.map((col) => {
            if (col.filter!.type === 'date') {
              const range = dateFilters[col.key] ?? { from: '', to: '' }
              return (
                <div key={col.key} className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {col.header}
                  </span>
                  <div className="flex items-center gap-1">
                    <input
                      type="date"
                      value={range.from}
                      onChange={(e) =>
                        setDateFilters({ ...dateFilters, [col.key]: { ...range, from: e.target.value } })
                      }
                      className="rounded-md border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                    />
                    <span className="text-xs text-slate-400">–</span>
                    <input
                      type="date"
                      value={range.to}
                      onChange={(e) =>
                        setDateFilters({ ...dateFilters, [col.key]: { ...range, to: e.target.value } })
                      }
                      className="rounded-md border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                    />
                  </div>
                </div>
              )
            }

            // status / select dropdown
            const options = col.filter!.options ?? []
            return (
              <div key={col.key} className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {col.header}
                </span>
                <select
                  value={columnFilters[col.key] ?? ''}
                  onChange={(e) => setColumnFilters({ ...columnFilters, [col.key]: e.target.value })}
                  className="rounded-md border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                >
                  <option value="">All</option>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Result count ────────────────────────────────────────────────────── */}
      <p className="text-xs text-slate-400 dark:text-slate-500">
        {totalFiltered === 0
          ? `0 of ${data.length} record${data.length !== 1 ? 's' : ''}`
          : `Showing ${showingFrom}–${showingTo} of ${totalFiltered}${totalFiltered !== data.length ? ` (filtered from ${data.length})` : ''} record${totalFiltered !== 1 ? 's' : ''}`}
      </p>

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
            <tr>
              {columns.map((col) => {
                const isSorted = sortKey === col.key
                const isRight = col.align === 'right'
                const isCenter = col.align === 'center'

                return (
                  <th
                    key={col.key}
                    className={`px-3 py-2 ${isRight ? 'text-right' : isCenter ? 'text-center' : ''} ${
                      col.sortable ? 'cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200' : ''
                    }`}
                    onClick={col.sortable ? () => toggleSort(col.key) : undefined}
                  >
                    <span className="inline-flex items-center">
                      {col.header}
                      {col.sortable && <SortIcon direction={isSorted ? sortDir : null} />}
                    </span>
                  </th>
                )
              })}
              {renderActions && <th className="px-3 py-2 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr
                key={rowKey(row)}
                className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                {columns.map((col) => {
                  const isRight = col.align === 'right'
                  const isCenter = col.align === 'center'

                  return (
                    <td
                      key={col.key}
                      className={`px-3 py-2 ${isRight ? 'text-right' : isCenter ? 'text-center' : ''}`}
                    >
                      {col.render ? col.render(row) : renderDefaultCell(row, col.key)}
                    </td>
                  )
                })}
                {renderActions && <td className="px-3 py-2 text-right">{renderActions(row)}</td>}
              </tr>
            ))}

            {paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={totalColumns}
                  className="px-3 py-8 text-center text-sm text-slate-400 dark:text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination bar ──────────────────────────────────────────────────── */}
      {paginated && totalFiltered > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Page size selector */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Rows per page</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value) as PageSize)}
              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Page numbers + prev/next */}
          <div className="flex items-center gap-1">
            {/* Prev */}
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage(safePage - 1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm text-slate-500 transition hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed dark:text-slate-400 dark:hover:bg-slate-700"
              aria-label="Previous page"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Page numbers */}
            {getPageNumbers().map((page, idx) =>
              page === null ? (
                <span key={`ellipsis-${idx}`} className="px-1 text-slate-400 dark:text-slate-500">
                  …
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition ${
                    page === safePage
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            {/* Next */}
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage(safePage + 1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm text-slate-500 transition hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed dark:text-slate-400 dark:hover:bg-slate-700"
              aria-label="Next page"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Default cell renderer ────────────────────────────────────────────────────

function renderDefaultCell<T>(row: T, key: string): ReactNode {
  const raw = getRawValue(row, key)
  if (raw == null) return ''
  return String(raw)
}

// ── Convenience: status badge renderer (reusable by modules) ─────────────────

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyles[status] ?? ''}`}>
      {status}
    </span>
  )
}
