import { blotterRows } from '../data/dashboardData'
import type { BlotterRow } from '../types/dashboard'
import { createInMemoryCrudService } from './shared/inMemoryCrud'

const blotterCrud = createInMemoryCrudService<BlotterRow>(blotterRows, (item) => item.code)

export const blotterService = {
  ...blotterCrud,
}
