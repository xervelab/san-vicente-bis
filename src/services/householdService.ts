import { householdRows } from '../data/dashboardData'
import type { HouseholdRow } from '../types/dashboard'
import { createHttpCrudService } from './shared/httpCrud'
import { createInMemoryCrudService, type CrudMethods } from './shared/inMemoryCrud'
import { USE_HTTP_SERVICES } from './shared/serviceConfig'

const householdCrud: CrudMethods<HouseholdRow> = USE_HTTP_SERVICES
  ? createHttpCrudService<HouseholdRow>('/households')
  : createInMemoryCrudService<HouseholdRow>(householdRows, (item) => item.head)

export const householdService = {
  ...householdCrud,
}
