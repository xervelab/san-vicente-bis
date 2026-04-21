import { blotterRows } from '../data/dashboardData'
import type { BlotterRow } from '../types/dashboard'
import { createHttpCrudService } from './shared/httpCrud'
import { createInMemoryCrudService, type CrudMethods } from './shared/inMemoryCrud'
import { USE_HTTP_SERVICES } from './shared/serviceConfig'

const blotterCrud: CrudMethods<BlotterRow> = USE_HTTP_SERVICES
  ? createHttpCrudService<BlotterRow>('/blotter-records')
  : createInMemoryCrudService<BlotterRow>(blotterRows, (item) => item.code)

export const blotterService = {
  ...blotterCrud,
}
