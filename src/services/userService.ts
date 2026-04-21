import { userRows } from '../data/dashboardData'
import type { UserRow } from '../types/dashboard'
import { createHttpCrudService } from './shared/httpCrud'
import { createInMemoryCrudService, type CrudMethods } from './shared/inMemoryCrud'
import { USE_HTTP_SERVICES } from './shared/serviceConfig'

const userCrud: CrudMethods<UserRow> = USE_HTTP_SERVICES
  ? createHttpCrudService<UserRow>('/users')
  : createInMemoryCrudService<UserRow>(userRows, (item) => item.email)

export const userService = {
  ...userCrud,
}
