import { certificateRows } from '../data/dashboardData'
import type { CertificateRow } from '../types/dashboard'
import { createInMemoryCrudService } from './shared/inMemoryCrud'

const certificateCrud = createInMemoryCrudService<CertificateRow>(
  certificateRows,
  (item) => `${item.type}-${item.resident}`,
)

export const certificateService = {
  ...certificateCrud,
}
