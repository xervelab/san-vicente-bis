import { userRows } from '../data/dashboardData'
import type { UserRow } from '../types/dashboard'
import { createInMemoryCrudService } from './shared/inMemoryCrud'

const userCrud = createInMemoryCrudService<UserRow>(userRows, (item) => item.email)

export const userService = {
  ...userCrud,
}
