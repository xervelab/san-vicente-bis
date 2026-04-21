import { useCallback, useEffect, useState } from 'react'
import type { ReportRow } from '../types/dashboard'
import { reportService, type ReportSummary } from '../services/reportService'

export function useReportsModule() {
  const [items, setItems] = useState<ReportRow[]>([])
  const [summary, setSummary] = useState<ReportSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const [rows, reportSummary] = await Promise.all([
        reportService.getAll(),
        reportService.getSummary(),
      ])
      setItems(rows)
      setSummary(reportSummary)
    } catch {
      setError('Failed to load report data.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  return {
    items,
    summary,
    isLoading,
    error,
    loadData,
  }
}
