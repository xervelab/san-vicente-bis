import { householdRows } from '../data/dashboardData'
import type { HouseholdRow } from '../types/dashboard'
import { createInMemoryCrudService } from './shared/inMemoryCrud'

const householdCrud = createInMemoryCrudService<HouseholdRow>(householdRows, (item) => item.head)

export const householdService = {
  ...householdCrud,
}
