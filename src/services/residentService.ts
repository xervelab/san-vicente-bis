import { residentRows } from '../data/dashboardData'
import type { ResidentRow } from '../types/dashboard'
import { createInMemoryCrudService } from './shared/inMemoryCrud'

const residentCrud = createInMemoryCrudService<ResidentRow>(residentRows, (item) => item.name)

export const residentService = {
  ...residentCrud,
}
