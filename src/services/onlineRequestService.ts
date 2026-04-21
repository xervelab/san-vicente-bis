import { onlineRequestRows } from '../data/dashboardData'
import type { OnlineRequestRow } from '../types/dashboard'
import { createHttpCrudService } from './shared/httpCrud'
import { createInMemoryCrudService, type CrudMethods } from './shared/inMemoryCrud'
import { USE_HTTP_SERVICES } from './shared/serviceConfig'

const onlineRequestCrud: CrudMethods<OnlineRequestRow> = USE_HTTP_SERVICES
  ? createHttpCrudService<OnlineRequestRow>('/online-requests')
  : createInMemoryCrudService<OnlineRequestRow>(onlineRequestRows, (item) => item.id)

export const onlineRequestService = {
  ...onlineRequestCrud,
}
