import { reportRows } from '../data/dashboardData'
import type { ReportRow } from '../types/dashboard'

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

export const reportService = {
  async getAll() {
    await wait(220)
    return clone(reportRows)
  },
  async getSummary() {
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
