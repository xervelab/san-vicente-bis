import { certificateRows } from '../data/dashboardData'
import type { CertificateRow } from '../types/dashboard'
import { createHttpCrudService } from './shared/httpCrud'
import { createInMemoryCrudService, type CrudMethods } from './shared/inMemoryCrud'
import { USE_HTTP_SERVICES } from './shared/serviceConfig'

const certificateCrud: CrudMethods<CertificateRow> = USE_HTTP_SERVICES
  ? createHttpCrudService<CertificateRow>('/certificates')
  : createInMemoryCrudService<CertificateRow>(
      certificateRows,
      (item) => `${item.type}-${item.resident}`,
    )

export const certificateService = {
  ...certificateCrud,
}
