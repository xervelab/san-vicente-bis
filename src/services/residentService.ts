import { residentRows } from '../data/dashboardData'
import type { ResidentRow } from '../types/dashboard'
import { createHttpCrudService } from './shared/httpCrud'
import { createInMemoryCrudService, type CrudMethods } from './shared/inMemoryCrud'
import { USE_HTTP_SERVICES } from './shared/serviceConfig'

const residentCrud: CrudMethods<ResidentRow> = USE_HTTP_SERVICES
  ? createHttpCrudService<ResidentRow>('/residents')
  : createInMemoryCrudService<ResidentRow>(residentRows, (item) => item.id)

export const residentService = {
  ...residentCrud,
}
