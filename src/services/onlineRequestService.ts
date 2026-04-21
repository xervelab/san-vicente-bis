import { onlineRequestRows } from '../data/dashboardData'
import type { OnlineRequestRow } from '../types/dashboard'
import { createInMemoryCrudService } from './shared/inMemoryCrud'

const onlineRequestCrud = createInMemoryCrudService<OnlineRequestRow>(onlineRequestRows, (item) => item.id)

export const onlineRequestService = {
  ...onlineRequestCrud,
}
