import { reportRows } from '../data/dashboardData'
import type { ReportRow } from '../types/dashboard'
import { httpClient } from './shared/httpClient'
import { USE_HTTP_SERVICES } from './shared/serviceConfig'

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

export const reportService = {
  async getAll() {
    if (USE_HTTP_SERVICES) {
      return httpClient.get<ReportRow[]>('/reports')
    }

    await wait(220)
    return clone(reportRows)
  },
  async getSummary() {
    if (USE_HTTP_SERVICES) {
      return httpClient.get<ReportSummary>('/reports/summary')
    }

    await wait(220)
    return {
      totalCards: reportRows.length,
      generatedAt: new Date().toISOString(),
    }
  },
}

export type ReportSummary = {
  totalCards: number
  generatedAt: string
}

export type ReportService = {
  getAll: () => Promise<ReportRow[]>
  getSummary: () => Promise<ReportSummary>
}
